import { stringify } from 'flatted';
import { addPlugin as addFlipperPlugin } from 'react-native-flipper';
import { CachedQuery, QueryCache } from 'react-query';

type SerializedQueriesPayload = {
  queries: string;
};

export function addPlugin(queryCache: QueryCache) {
  let unsubscribe: (() => void) | undefined;

  function getQueries() {
    return queryCache.getQueries(() => true);
  }

  function getQueryByHash(queryHash: string): CachedQuery<unknown> {
    // @ts-ignore
    return queryCache.getQueries((query) => query.queryHash === queryHash)[0];
  }

  function getSerializedQueries(): SerializedQueriesPayload {
    return {
      queries: stringify(getQueries()),
    };
  }

  addFlipperPlugin({
    getId: () => 'flipper-plugin-react-query-native-devtools',
    onConnect(connection) {
      unsubscribe = queryCache.subscribe(() => {
        connection.send('queries', getSerializedQueries());
      });

      connection.receive('query:refetch', ({ queryHash }, responder) => {
        // @ts-ignore
        getQueryByHash(queryHash)?.fetch();
        responder.success();
      });
      connection.receive('query:remove', ({ queryHash }, responder) => {
        // @ts-ignore
        queryCache.removeQueries((query) => query.queryHash === queryHash);
        responder.success();
      });

      // send initial queries
      connection.send('queries', getSerializedQueries());
    },
    onDisconnect() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
      }
    },
    runInBackground: () => true,
  });
}
