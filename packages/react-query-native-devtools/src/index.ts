import { stringify } from 'flatted';
import { addPlugin as addFlipperPlugin, Flipper } from 'react-native-flipper';
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
    const queries = getQueries();

    const serializedQueries = {
      queries: stringify(queries),
    };

    return serializedQueries;
  }

  /**
   * handles QueryCacheNotifyEvent
   * @param event - QueryCacheNotifyEvent, but RQ doesn't have it exported
   */
  const handleCacheEvent =
    (connection: Flipper.FlipperConnection) => (event: any) => {
      connection.send('queryCacheEvent', {
        cashEvent: stringify(event),
      });
    };

  addFlipperPlugin({
    getId: () => 'flipper-plugin-react-query-native-devtools',
    onConnect(connection) {
      // send initial queries
      connection.send('queries', getSerializedQueries());

      // Subscribe to QueryCacheNotifyEvent and send updates only
      unsubscribe = queryCache.subscribe(handleCacheEvent(connection));

      connection.receive('queryRefetch', ({ queryHash }, responder) => {
        getQueryByHash(queryHash)?.fetch();
        responder.success({ ack: true });
      });

      connection.receive('queryRemove', ({ queryHash }, responder) => {
        const query = getQueryByHash(queryHash);
        if (query) {
          queryClient.removeQueries(query.queryKey, { exact: true });
        }
        responder.success({ ack: true });
      });
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
