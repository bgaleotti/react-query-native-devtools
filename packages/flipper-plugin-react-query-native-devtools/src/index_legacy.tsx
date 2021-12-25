import { parse } from 'flatted';
import { colors, FlexRow, FlipperPlugin, PluginClient, styled } from 'flipper';
import React, { FunctionComponent, useState } from 'react';
import { Query } from 'react-query';

import QueryTable from './components/query-table';
import Sidebar from './components/sidebar';

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

type ReactQueryDevtoolsProps = {
  client: PluginClient;
  persistedState: PersistedState;
};

const ReactQueryDevtools: FunctionComponent<ReactQueryDevtoolsProps> = ({ client, persistedState }) => {
  const { queries } = persistedState;
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const selectedQuery = selectedQueries.length === 1 ? selectedQueries[0] : null;
  const query = queries.find((query: Query): boolean => query.queryHash === selectedQuery);

  const onQueryRefetch = (query: Query): void => {
    client.call('query:refetch', { queryHash: query.queryHash });
  };

  const onQueryRemove = (query: Query): void => {
    client.call('query:remove', { queryHash: query.queryHash });
  };

  return (
    <Container>
      <QueryTable queries={Object.values(queries)} onSelect={setSelectedQueries} />
      <Sidebar query={query} onQueryRefetch={onQueryRefetch} onQueryRemove={onQueryRemove} />
    </Container>
  );
};

type Payload = {
  queries: string;
};

export default class ReactQueryDevtoolsFlipperPlugin extends FlipperPlugin<{}, any, PersistedState> {
  static title = 'React Query Devtools';
  static icon = 'app-react';
  static defaultPersistedState = {
    queries: [],
  };
  static persistedStateReducer(persistedState: PersistedState, method: string, payload: Payload): PersistedState {
    if (method === 'queries') {
      return {
        ...persistedState,
        queries: parse(payload.queries) as Query[],
      };
    }

    return persistedState;
  }

  render() {
    return <ReactQueryDevtools client={this.client} persistedState={this.props.persistedState} />;
  }
}
