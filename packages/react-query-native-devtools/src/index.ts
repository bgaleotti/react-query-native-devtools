import { addPlugin as addFlipperPlugin } from 'react-native-flipper';
import { CachedQuery, QueryCache } from 'react-query';

export function addPlugin(queryCache: QueryCache) {
  let unsubscribe: (() => void) | undefined;

  function getQueries(): CachedQuery[] {
    return queryCache.getQueries(() => true);
  }

  function getQueryByHash(queryHash: string): CachedQuery | undefined {
    return queryCache.getQueries(
      (query: CachedQuery) => query.queryHash === queryHash
    )[0];
  }

  addFlipperPlugin({
    getId: () => 'flipper-plugin-react-query-native-devtools',
    onConnect(connection) {
      unsubscribe = queryCache.subscribe(() => {
        connection.send('queries', getQueries());
      });

      connection.receive('query:refetch', (queryHash, responder) => {
        getQueryByHash(queryHash)?.fetch();
        responder.success();
      });
      connection.receive('query:remove', (queryHash, responder) => {
        queryCache.removeQueries(query => query.queryHash === queryHash);
        responder.success();
      });

      // send initial queries
      connection.send('queries', getQueries());
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
