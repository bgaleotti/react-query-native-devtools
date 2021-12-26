import { Button } from 'antd';
import { DataInspector, DetailSidebar, Panel, Toolbar, usePlugin, useValue } from 'flipper-plugin';
import React from 'react';

import { plugin } from '../index';

export const QuerySidebar: React.FC = () => {
  const instance = usePlugin(plugin);
  const selectedQueryId = useValue(instance.selectedQueryId);
  if (!selectedQueryId) {
    return null;
  }
  const query = instance.queries.getById(selectedQueryId);
  if (!query) {
    return null;
  }

  return (
    <DetailSidebar>
      <Panel title="Actions" collapsed={true}>
        <Toolbar>
          <Button
            type="primary"
            disabled={query.state.isFetching}
            onClick={(): void => {
              instance.handleQueryRefetch(query);
            }}>
            Refetch
          </Button>
          <Button
            type="default"
            danger={true}
            onClick={(): void => {
              instance.handleQueryRemove(query);
            }}>
            Remove
          </Button>
        </Toolbar>
      </Panel>
      <Panel title="Data Explorer" collapsed={true}>
        <DataInspector data={query.state?.data || {}} expandRoot={true} collapsed={true} />
      </Panel>
      <Panel title="Query Explorer" collapsed={true}>
        <DataInspector data={query} expandRoot={true} collapsed={true} />
      </Panel>
    </DetailSidebar>
  );
};
