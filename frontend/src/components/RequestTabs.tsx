import { Tabs, Tab } from '@mui/material';
import React from 'react';
import { RequestTab } from '../types/request';

type RequestTabsProps = {
  activeTab: RequestTab;
  setActiveTab: (tab: RequestTab) => void;
};

const RequestTabs: React.FC<RequestTabsProps> = ({
  activeTab,
  setActiveTab,
}) => (
  <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
    <Tab label="Params" value="params" />
    <Tab label="Headers" value="headers" />
    <Tab label="Body" value="body" />
    <Tab label="Auth" value="auth" />
    <Tab label="Response" value="response" />
  </Tabs>
);

export default RequestTabs;
