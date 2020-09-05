import padStart from 'lodash/padStart';

import { Query } from '../types';

export function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) {
    return '-';
  }

  const date = new Date(timestamp);

  return `${padStart(date.getHours().toString(), 2, '0')}:${padStart(date.getMinutes().toString(), 2, '0')}:${padStart(
    date.getSeconds().toString(),
    2,
    '0',
  )}.${padStart(date.getMilliseconds().toString(), 3, '0')}`;
}

export function getQueryStatusLabel(query: Query): string {
  return query.state.isFetching
    ? 'fetching'
    : !query?.instances?.length || !query?.observers?.length
    ? 'inactive'
    : query.state.isStale
    ? 'stale'
    : 'fresh';
}
