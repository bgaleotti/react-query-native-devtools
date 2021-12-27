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
import { NotifyEventQueryAdded, QueryCacheNotifyEvent } from './types/queryCacheNotifyEvent';
import { formatTimestamp, getObserversCounter, isQueryActive } from './utils';

type Events = {
  queries: { queries: string };
  queryCacheEvent: { cashEvent: string };
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
  dataUpdateCount: number;
  observersCount: number;
  isQueryActive: boolean;
};

const extendQuery = (query: Query): ExtendedQuery => {
  const extendedQuery = query as ExtendedQuery;
  extendedQuery.status = query.state.status;
  extendedQuery.dataUpdateCount = query.state.dataUpdateCount;
  extendedQuery.observersCount = getObserversCounter(query);
  extendedQuery.isQueryActive = isQueryActive(query);

  return extendedQuery;
};
export const plugin = (client: PluginClient<Events, Methods>): PluginReturn => {
  const queries = createDataSource<ExtendedQuery, 'queryHash'>([], {
    key: 'queryHash',
  });
  const selectedQueryId = createState<string | undefined>(undefined);

  client.onMessage('queries', (event) => {
    parse(event.queries).forEach((query: ExtendedQuery) => {
      queries.append(extendQuery(query));
    });
  });

  client.onMessage('queryCacheEvent', (event) => {
    const cashEvent = parse(event.cashEvent) as QueryCacheNotifyEvent;
    const {
      type,
      query,
      query: { queryHash },
    } = cashEvent;

    if (!type) {
      return;
    }

    switch (type) {
      case 'queryAdded':
        queries.append(extendQuery(query));
        break;
      case 'queryRemoved':
        queries.deleteByKey(queryHash);
        break;
      case 'queryUpdated':
      case 'observerAdded':
      case 'observerRemoved':
      case 'observerResultsUpdated':
        queries.upsert(extendQuery(query));
        break;
      default:
        break;
    }
  });

  const handleOnSelect = (record: ExtendedQuery): void => {
    selectedQueryId.set(record?.queryHash);
  };

  const handleQueryRefetch = (query: ExtendedQuery): void => {
    client.send('queryRefetch', { queryHash: query.queryHash });
  };

  const handleQueryRemove = (query: ExtendedQuery): void => {
    queries.deleteByKey(query.queryHash);
    client.send('queryRemove', { queryHash: query.queryHash });
  };

  return { queries, selectedQueryId, handleOnSelect, handleQueryRefetch, handleQueryRemove };
};

const columns: DataTableColumn<ExtendedQuery>[] = [
  {
    key: 'state',
    title: 'Data Updated At',
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
    key: 'dataUpdateCount',
    title: 'Data Updated Count',
    width: 40,
    visible: true,
  },
  {
    key: 'isQueryActive',
    title: 'isActive',
    width: 40,
    visible: true,
  },
  {
    key: 'observersCount',
    title: 'Observers',
    width: 30,
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
