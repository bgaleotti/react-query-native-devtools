import padStart from 'lodash/padStart';
import { nanoid } from 'nanoid';
import type { Query } from 'react-query';

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

export function getObserversCounter(query: Query): number {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  return query.observers.length;
}

export function isQueryActive(query: Query): boolean {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  return query.observers.some((observer) => observer.options.enabled !== false);
}

export function makeQuerySelectionKey(query: Query): string {
  const key = `${nanoid(10)}-${query.queryHash}`;

  return key;
}
