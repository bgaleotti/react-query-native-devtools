// FIXME: revert
/* eslint-disable no-console */
/* eslint-disable no-undef */
import { parse } from 'flatted';
import { Atom, createState, PluginClient, usePlugin, useValue } from 'flipper-plugin';
import React from 'react';
import type { Query, QueryKey } from 'react-query';
// import type { QueryCacheNotifyEvent } from 'types/queryCacheNotifyEvent';

type Events = {
  queries: string;
};

type PluginReturn = {
  queries: Atom<Query<unknown, unknown, unknown, QueryKey>[]>;
};

export const plugin = (client: PluginClient<Events, {}>): PluginReturn => {
  const queries = createState<Query[]>([]);
  client.onMessage('queries', (event) => {
    // console.log('5+++ ~ file: index.ts ~ line 53 ~ onMessage ~ event', event);
    queries.set(parse(event));
  });

  return { queries };
};

export const Component: React.FC = () => {
  const instance = usePlugin(plugin);
  console.log('5+++ ~ file: index.tsx ~ line 27 ~ instance', instance);
  const queries = useValue(instance.queries);
  console.log('5+++ ~ file: index.tsx ~ line 29 ~ queries', queries);

  return <></>;
};
