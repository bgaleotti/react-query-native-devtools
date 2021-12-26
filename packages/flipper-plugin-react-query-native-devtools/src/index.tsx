/* eslint-disable no-console */
/* eslint-disable no-undef */
import { parse } from 'flatted';
import {
  Atom,
  createDataSource,
  createState,
  DataSource,
  DataTable,
  DataTableColumn,
  Layout,
  PluginClient,
  usePlugin,
} from 'flipper-plugin';
import React from 'react';
import type { Query, QueryStatus } from 'react-query';

import { QuerySidebar } from './components/QuerySidebar';
import { formatTimestamp, getObserversCounter, isQueryActive } from './utils';

type Events = {
  queries: { queries: string };
};
type Methods = {
  queryRefetch(params: { queryHash: string }): Promise<void>;
  queryRemove(params: { queryHash: string }): Promise<void>;
};

type PluginReturn = {
  queries: DataSource<ExtendedQuery, string>;
  selectedQueryId: Atom<string | undefined>;
  handleOnSelect: (record: ExtendedQuery) => void;
  handleQueryRefetch: (query: ExtendedQuery) => void;
  handleQueryRemove: (query: ExtendedQuery) => void;
};

export type ExtendedQuery = Query & {
  status: QueryStatus;
  observersCount: number;
  isQueryActive: boolean;
};

export const plugin = (client: PluginClient<Events, Methods>): PluginReturn => {
  const queries = createDataSource<ExtendedQuery, 'queryHash'>([], {
    key: 'queryHash',
  });
  console.log('5+++ ~ file: index.tsx ~ line 22 ~ plugin ~ client', client);
  const selectedQueryId = createState<string | undefined>(undefined);
  client.onMessage('queries', (event) => {
    // console.log('5+++ ~ file: index.ts ~ line 53 ~ onMessage ~ event', event);
    // console.log('5+++ ~ file: index.ts ~ line 54 ~ onMessage ~ parse(event)', parse(event.queries));
    parse(event.queries).forEach((query: ExtendedQuery) => {
      query.status = query.state.status;
      query.observersCount = getObserversCounter(query);
      query.isQueryActive = isQueryActive(query);
      queries.upsert(query);
    });
  });

  const handleOnSelect = (record: ExtendedQuery): void => {
    selectedQueryId.set(record?.queryHash);
  };

  const handleQueryRefetch = (query: ExtendedQuery): void => {
    client.send('queryRefetch', { queryHash: query.queryHash });
  };

  const handleQueryRemove = (query: ExtendedQuery): void => {
    client.send('queryRemove', { queryHash: query.queryHash });
  };

  return { queries, selectedQueryId, handleOnSelect, handleQueryRefetch, handleQueryRemove };
};

const columns: DataTableColumn<ExtendedQuery>[] = [
  {
    key: 'state',
    title: 'Data Updated Time',
    width: 100,
    visible: true,
    formatters: [
      (value: Query['state']): string => {
        return formatTimestamp(value.dataUpdatedAt);
      },
    ],
  },
  {
    key: 'status',
    title: 'Status',
    width: 80,
    visible: true,
  },
  {
    key: 'observersCount',
    title: 'Observers',
    width: 30,
    visible: true,
  },
  {
    key: 'isQueryActive',
    title: 'isActive',
    width: 40,
    visible: true,
  },
  {
    key: 'queryHash',
    title: 'Query Hash',
    wrap: true,
  },
];
export const Component: React.FC = () => {
  const instance = usePlugin(plugin);
  console.log('5+++ ~ file: index.tsx ~ line 54 ~ instance.queries', instance.queries);

  return (
    <Layout.Container grow>
      <DataTable
        dataSource={instance.queries}
        onSelect={instance.handleOnSelect}
        columns={columns}
        enableMultiSelect={false}
      />
      <QuerySidebar />
    </Layout.Container>
  );
};
