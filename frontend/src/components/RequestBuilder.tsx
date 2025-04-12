import React, { useState } from 'react';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import RequestEditor from './RequestEditor';
import { HttpMethod, KeyValue, RequestTab } from '../types/request';
import RequestTabs from './RequestTabs';
import KeyValueEditor from './shared/KeyValueEditor';
import JsonEditor from './shared/JsonEditor';
import { createRequest } from '../services/requestServices';
import { buildUrlWithQueryParameters, createObjectFromKeyValueArray } from '../utils/requestUtils';
import HistorySidebar from './HistorySidebar';

const RootContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
});

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  borderBottom: '1px solid #e0e0e0',
});

const Content = styled('div')({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

const SidebarContainer = styled('div')({
  width: 200,
  padding: 8,
});

const MainPanel = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 24,
  overflow: 'hidden',
});

const TabContent = styled('div')({
  flex: 1,
  overflow: 'auto',
});

const RequestBuilder: React.FC = () => {
  const [requestMethod, setRequestMethod] = useState<HttpMethod>('GET');
  const [requestUrl, setRequestUrl] = useState('');
  const [activeTab, setActiveTab] = useState<RequestTab>('params');
  const [queryParams, setQueryParams] = useState<KeyValue[]>([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState<KeyValue[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState<string>('{\n  \n}');
  const [response, setResponse] = useState<string>('');

  const handleSendRequest = async () => {
    try {
      console.log(body);
      const createdRequest = await createRequest({
        method: requestMethod,
        body: body,
        headers: createObjectFromKeyValueArray(headers),
        url: buildUrlWithQueryParameters(requestUrl, queryParams),
      });
      setResponse(JSON.stringify(createdRequest.responseBody, null, 2));
      setActiveTab('response');
    } catch (error) {
      console.log(error);
    }
  };

  const tabComponents: Record<RequestTab, React.ReactNode> = {
    params: <KeyValueEditor items={queryParams} updateItems={setQueryParams} />,
    headers: <KeyValueEditor items={headers} updateItems={setHeaders} />,
    body: <JsonEditor json={body} updateJson={setBody} />,
    response: response.length === 0 ? <></> : <JsonEditor json={response} updateJson={setResponse} readonly={true} />,
  };

  return (
    <RootContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/post-melon-text.png" alt="Post Melon text" style={{ height: '60px' }} />
          <img src="/post-melon-logo.png" alt="Post Melon logo" style={{ height: '50px', marginLeft: '-20px' }} />
        </div>
      </Header>
      <Content>
        <SidebarContainer>
          <HistorySidebar />
        </SidebarContainer>
        <MainPanel>
          <RequestEditor
            requestMethod={requestMethod}
            setRequestMethod={setRequestMethod}
            requestUrl={requestUrl}
            setRequestUrl={setRequestUrl}
            onSend={handleSendRequest}
          />
          <RequestTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Divider sx={{ my: 2 }} />
          <TabContent>{tabComponents[activeTab]}</TabContent>
        </MainPanel>
      </Content>
    </RootContainer>
  );
};

export default RequestBuilder;
