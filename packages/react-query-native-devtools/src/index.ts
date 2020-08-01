import { addPlugin as addFlipperPlugin } from 'react-native-flipper';
import { CachedQuery, QueryCache } from 'react-query';

const getCircularReplacer = () => {
  const seen = new WeakSet();

  return (_: unknown, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }

      seen.add(value);
    }

    return value;
  };
};

type SerializableQuery = Partial<CachedQuery<unknown>>;

function transformQueryToSerializableQuery(
  query: CachedQuery<unknown>
): SerializableQuery {
  return JSON.parse(JSON.stringify(query, getCircularReplacer()));
}

export function addPlugin(queryCache: QueryCache) {
  let unsubscribe: (() => void) | undefined;

  function getQueries() {
    return queryCache.getQueries(() => true);
  }

  function getQueryByHash(queryHash: string): CachedQuery<unknown> {
    // @ts-ignore
    return queryCache.getQueries((query) => query.queryHash === queryHash)[0];
  }

  addFlipperPlugin({
    getId: () => 'flipper-plugin-react-query-native-devtools',
    onConnect(connection) {
      unsubscribe = queryCache.subscribe(() => {
        connection.send(
          'queries',
          getQueries().map(transformQueryToSerializableQuery)
        );
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
      connection.send(
        'queries',
        getQueries().map(transformQueryToSerializableQuery)
      );
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
