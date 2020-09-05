export type Query = {
  cancelled: boolean;
  config: {
    cacheTime: number;
    refetchAllOnWindowFocus: boolean;
    refetchInterval: boolean;
    refetchOnMount: boolean;
    retry: number;
    staleTime: number;
    suspense: boolean;
    throwOnError: boolean;
  };
  instances?: unknown[];
  observers?: unknown[];
  queryHash: string;
  queryKey: string[];
  queryVariables: unknown[];
  staleTimeout: number;
  state: {
    canFetchMore: boolean;
    data: unknown;
    error: string | null;
    failureCount: number;
    isFetching: boolean;
    isStale: boolean;
    markedForGarbageCollection: boolean;
    status: 'idle' | 'loading' | 'error' | 'success';
    updatedAt: number;
  };
  wasPrefetched: boolean;
  wasSuspensed: boolean;
  fetch: () => void;
};
