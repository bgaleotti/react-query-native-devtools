import { SearchableTable, styled, TableBodyRow, Text } from 'flipper';
import React, { FunctionComponent } from 'react';

import { Query } from '../types';
import { formatTimestamp, getQueryStatusLabel } from '../utils';

const COLUMN_SIZE = {
  updatedAt: 100,
  status: 100,
  queryHash: 'flex',
};

const COLUMN_ORDER = [
  { key: 'updatedAt', visible: true },
  { key: 'status', visible: true },
  { key: 'queryHash', visible: true },
];

const COLUMNS = {
  updatedAt: { value: 'Updated Time' },
  status: { value: 'Status' },
  queryHash: { value: 'Query Hash' },
};

const TextEllipsis = styled(Text)({
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  lineHeight: '18px',
  paddingTop: 4,
});

const buildRow = (query: Query): TableBodyRow => {
  return {
    columns: {
      updatedAt: {
        value: <TextEllipsis>{formatTimestamp(query.state.updatedAt)}</TextEllipsis>,
      },
      status: {
        value: <TextEllipsis>{getQueryStatusLabel(query)}</TextEllipsis>,
      },
      queryHash: {
        value: <TextEllipsis>{query.queryHash}</TextEllipsis>,
      },
    },
    key: query.queryHash,
  };
};

type QueryTableProps = {
  queries: Query[];
  onSelect: (queryHashes: string[]) => void | Promise<void>;
};

const QueryTable: FunctionComponent<QueryTableProps> = ({ queries, onSelect }) => {
  return (
    <SearchableTable
      autoHeight={true}
      columns={COLUMNS}
      columnSizes={COLUMN_SIZE}
      columnOrder={COLUMN_ORDER}
      floating={false}
      grow={true}
      multiline={false}
      rows={Object.values(queries).map(buildRow)}
      onRowHighlighted={onSelect}
    />
  );
};

export default QueryTable;
