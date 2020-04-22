import * as ReactQuery from 'react-query';

declare module "react-query" {
  export interface CachedQuery extends ReactQuery.CachedQuery {
    queryHash: string,
    fetch: <TResult>({ force }?: { force?: boolean }) => Promise<TResult>,
  }

  export interface QueryCache extends ReactQuery.QueryCache {
    getQueries(
      queryKeyOrPredicateFn:
        | AnyQueryKey
        | string
        | ((query: CachedQuery) => boolean),
      {
        exact,
      }?: { exact?: boolean }
    ) : CachedQuery[],
  }
}
