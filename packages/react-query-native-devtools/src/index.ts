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
    console.log('5+++ ~ file: index.ts ~ line 28 ~ getSerializedQueries ~ queries[0]', queries[0])

    const startSerializeTime = Date.now();
    const serializedQueries = {
      queries: stringify(queries),
    }
    const serializeTime = Date.now() - startSerializeTime;
    console.log('5+++ ~ file: index.ts ~ line 34 ~ getSerializedQueries ~ serializeTime', serializeTime)

    return serializedQueries;
  }

  /**
   * handles QueryCacheNotifyEvent
   * @param event - QueryCacheNotifyEvent, but RQ doesn't have it exported
   */
  const handleCacheEvent = (connection: Flipper.FlipperConnection) => (event: any) => {
    console.log('5+++ ~ file: index.ts ~ line 44 ~ handleCacheEvent ~ event.type', event.type)
    // console.log('5+++ ~ file: index.ts ~ line 45 ~ handleCacheEvent ~ event.queryHash', event.query.queryHash)
    console.log('5+++ ~ file: index.ts ~ line 45 ~ handleCacheEvent ~ event.query', event.query)
    
    connection.send('queries', getSerializedQueries());
  }

  addFlipperPlugin({
    getId: () => 'flipper-plugin-react-query-native-devtools',
    onConnect(connection) {
      console.log('5+++ ~ file: index.ts ~ line 53 ~ onConnect ~ connection', connection)

      unsubscribe = queryCache.subscribe(handleCacheEvent(connection));

      connection.receive('query:refetch', ({ queryHash }, responder) => {
        getQueryByHash(queryHash)?.fetch();
        responder.success({ ack: true });
      });
      connection.receive('query:remove', ({ queryHash }, responder) => {
        const query = getQueryByHash(queryHash);
        if (query) {
          queryClient.removeQueries(query.queryKey, { exact: true });
        }
        responder.success({ ack: true });
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
