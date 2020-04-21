import { colors, FlexRow, styled } from 'flipper';
import { createFlipperPlugin, useFlipper } from 'flipper-hooks';
import React, { FunctionComponent, useState } from 'react';

import QueryTable from './components/query-table';
import Sidebar from './components/sidebar';
import { Query } from './types';

const Container = styled(FlexRow)({
  backgroundColor: colors.macOSTitleBarBackgroundBlur,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  alignContent: 'flex-start',
  flexGrow: 1,
  overflow: 'scroll',
});

type PersistedState = {
  queries: Query[];
};

const ReactQueryDevtools: FunctionComponent = () => {
  const { client, persistedState } = useFlipper();
  const { queries } = persistedState;
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const selectedQuery = selectedQueries.length === 1 ? selectedQueries[0] : null;
  const query = selectedQuery ? queries.find((query: Query): boolean => query.queryHash === selectedQuery) : null;

  const onQueryRefetch = (query: Query): void => {
    client.call('query:refetch', query.queryHash);
  };

  const onQueryRemove = (query: Query): void => {
    client.call('query:remove', query.queryHash);
  };

  return (
    <Container>
      <QueryTable queries={Object.values(queries)} onSelect={setSelectedQueries} />
      <Sidebar query={query} onQueryRefetch={onQueryRefetch} onQueryRemove={onQueryRemove} />
    </Container>
  );
};

export default createFlipperPlugin<{}, PersistedState>(
  'flipper-plugin-react-query-native-devtools',
  ReactQueryDevtools,
  {
    title: 'React Query Devtools',
    icon: 'app-react',
    defaultPersistedState: {
      queries: [],
    },
    persistedStateReducer: (persistedState: PersistedState, method: string, queries: Query[]): PersistedState => {
      if (method === 'queries') {
        return {
          ...persistedState,
          queries,
        };
      }

      return persistedState;
    },
  },
);
