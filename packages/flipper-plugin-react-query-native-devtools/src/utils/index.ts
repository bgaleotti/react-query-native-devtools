// @ts-nocheck

import padStart from 'lodash/padStart';
import { Query } from 'react-query';

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

function isStale(query: Query): boolean {
  // TODO: support observers state
  return query.state.isInvalidated || !query.state.dataUpdatedAt;
}

function isInactive(query: Query): boolean {
  return query.observers.length === 0;
}

export function getQueryStatusLabel(query: Query): string {
  return query.state.isFetching ? 'fetching' : isInactive(query) ? 'inactive' : isStale(query) ? 'stale' : 'fresh';
}
