import { stringify } from 'flatted';
import { addPlugin as addFlipperPlugin } from 'react-native-flipper';
import { Query, QueryClient } from 'react-query';

type SerializedQueriesPayload = {
  queries: string;
};

type PluginProps = {
  queryClient: QueryClient;
};

export function addPlugin({ queryClient }: PluginProps) {
  const queryCache = queryClient.getQueryCache();

  let unsubscribe: (() => void) | undefined;

  function getQueries() {
    return queryCache.getAll();
  }

  function getQueryByHash(queryHash: string): Query | undefined {
    return getQueries().find((query) => query.queryHash === queryHash);
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
        getQueryByHash(queryHash)?.fetch();
        responder.success(true);
      });
      connection.receive('query:remove', ({ queryHash }, responder) => {
        const query = getQueryByHash(queryHash);
        if (query) {
          queryClient.removeQueries(query.queryKey, { exact: true });
        }
        responder.success(true);
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
