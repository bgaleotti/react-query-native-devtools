import { Button, DetailSidebar, ManagedDataInspector, Panel, Toolbar } from 'flipper';
import React, { FunctionComponent } from 'react';
import { Query } from 'react-query';

type SidebarProps = {
  query?: Query;
  onQueryRefetch: (query: Query) => void;
  onQueryRemove: (query: Query) => void;
};

const Sidebar: FunctionComponent<SidebarProps> = ({ query, onQueryRefetch, onQueryRemove }) => {
  if (!query) {
    return null;
  }

  return (
    <DetailSidebar>
      <Panel floating={false} heading="Actions">
        <Toolbar>
          <Button
            type="primary"
            disabled={query.state.isFetching}
            onClick={(): void => {
              onQueryRefetch(query);
            }}>
            Refetch
          </Button>
          <Button
            type="danger"
            onClick={(): void => {
              onQueryRemove(query);
            }}>
            Remove
          </Button>
        </Toolbar>
      </Panel>
      <Panel floating={false} heading="Data Explorer">
        <ManagedDataInspector data={query.state?.data || {}} expandRoot={true} />
      </Panel>
      <Panel floating={false} heading="Query Explorer">
        <ManagedDataInspector data={query} expandRoot={false} />
      </Panel>
    </DetailSidebar>
  );
};

export default Sidebar;
