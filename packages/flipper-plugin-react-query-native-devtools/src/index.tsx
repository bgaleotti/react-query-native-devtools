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
import type { Query } from 'react-query';

// import { QueryTable } from './components/QueryTable';
// import type { QueryCacheNotifyEvent } from 'types/queryCacheNotifyEvent';

type Events = {
  queries: { queries: string };
};

type PluginReturn = {
  queries: DataSource<Query, string>;
  selectedQueryId: Atom<string | null>;
  handleOnSelect: (record: Query) => void;
};

export const plugin = (client: PluginClient<Events, {}>): PluginReturn => {
  const queries = createDataSource<Query, 'queryHash'>([], {
    key: 'queryHash',
  });
  console.log('5+++ ~ file: index.tsx ~ line 22 ~ plugin ~ client', client);
  // const queries = createState<Query[]>([]);
  const selectedQueryId = createState<string | null>(null);
  client.onMessage('queries', (event) => {
    console.log('5+++ ~ file: index.ts ~ line 53 ~ onMessage ~ event', event);
    console.log('5+++ ~ file: index.ts ~ line 54 ~ onMessage ~ parse(event)', parse(event.queries));
    // queries.clear();
    parse(event.queries).forEach((query: Query) => queries.upsert(query));
  });

  const handleOnSelect = (record: Query): void => {
    selectedQueryId.set(record.queryHash);
  };

  return { queries, selectedQueryId, handleOnSelect };
};

export const Component: React.FC = () => {
  const instance = usePlugin(plugin);
  console.log('5+++ ~ file: index.tsx ~ line 54 ~ instance.queries', instance.queries);
  // console.log('5+++ ~ file: index.tsx ~ line 29 ~ queries', queries);
  // const selectedQueryId = useValue(instance.selectedQueryId);
  const baseColumns: DataTableColumn<Query>[] = [
    {
      key: 'queryHash',
      title: 'Query Hash',
      width: 300,
    },
    {
      key: 'state',
      title: 'Response Time',
      width: 300,
      visible: true,
    },
  ];

  return (
    <Layout.Container grow>
      {/* <QueryTable queries={instance.queries} onSelect={instance.setSelection} /> */}
      <DataTable dataSource={instance.queries} onSelect={instance.handleOnSelect} columns={baseColumns} />
    </Layout.Container>
  );
};
