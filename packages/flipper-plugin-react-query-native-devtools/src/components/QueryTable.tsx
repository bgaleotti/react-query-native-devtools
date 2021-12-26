/* eslint-disable no-console */
/* eslint-disable no-undef */
// import { DataList, Layout, styled, TableBodyRow, Text } from 'flipper-plugin';
import { DataSource, DataTable } from 'flipper-plugin';
import React, { FunctionComponent } from 'react';
import { Query } from 'react-query';

// import { formatTimestamp, getQueryStatusLabel } from '../utils';

// const COLUMN_SIZE = {
//   updatedAt: 100,
//   status: 100,
//   queryHash: 'flex',
// };

// const COLUMN_ORDER = [
//   { key: 'updatedAt', visible: true },
//   { key: 'status', visible: true },
//   { key: 'queryHash', visible: true },
// ];

// const COLUMNS = {
//   updatedAt: { value: 'Updated Time' },
//   status: { value: 'Status' },
//   queryHash: { value: 'Query Hash' },
// };

// const TextEllipsis = styled(Text)({
//   overflowX: 'hidden',
//   textOverflow: 'ellipsis',
//   maxWidth: '100%',
//   lineHeight: '18px',
//   paddingTop: 4,
// });

// const buildRow = (query: Query) => {
//   return {
//     columns: {
//       updatedAt: {
//         value: <TextEllipsis>{formatTimestamp(query.state.dataUpdatedAt)}</TextEllipsis>,
//       },
//       status: {
//         value: <TextEllipsis>{getQueryStatusLabel(query)}</TextEllipsis>,
//       },
//       queryHash: {
//         value: <TextEllipsis>{query.queryHash}</TextEllipsis>,
//       },
//     },
//     key: query.queryHash,
//   };
// };

type QueryTableProps = {
  queries: DataSource<Query, string>;
  onSelect: (queryHash: string) => void;
};
// items={[
//   { id: '1', title: 'my-title', status: '1111', value: 'value1' },
//   { id: '2', title: 'my-title02', status: '2222', value: 'value2' },
// ]}

export const QueryTable: FunctionComponent<QueryTableProps> = ({ queries, onSelect }) => {
  console.log('5+++ ~ file: QueryTable.tsx ~ line 57 ~ queries', queries);

  return <DataTable dataSource={queries} onSelect={onSelect} />;

  // <SearchableTable
  //   autoHeight={true}
  //   columns={COLUMNS}
  //   columnSizes={COLUMN_SIZE}
  //   columnOrder={COLUMN_ORDER}
  //   floating={false}
  //   grow={true}
  //   multiline={false}
  //   rows={Object.values(queries).map(buildRow)}
  //   onRowHighlighted={onSelect}
  // />
  // );
};
