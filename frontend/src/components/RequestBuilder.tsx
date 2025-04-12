import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import RequestEditor from './RequestEditor';
import { HttpMethod, KeyValue, RequestTab } from '../types/request';
import RequestTabs from './RequestTabs';
import KeyValueEditor from './shared/KeyValueEditor';
import JsonEditor from './shared/JsonEditor';
import { createRequest } from '../services/requestServices';
import { buildUrlWithQueryParameters, createObjectFromKeyValueArray } from '../utils/requestUtils';

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
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1} sx={{ marginBottom: -1 }}>
        <img src="/post-melon-text.png" alt="Post Melon text" style={{ height: '70px' }} />
        <img src="/post-melon-logo.png" alt="Post Melon logo" style={{ height: '50px', marginLeft: '-20px' }} />
      </Typography>
      <Divider />
      <RequestEditor
        requestMethod={requestMethod}
        setRequestMethod={setRequestMethod}
        requestUrl={requestUrl}
        setRequestUrl={setRequestUrl}
        onSend={handleSendRequest}
      />
      <RequestTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Divider sx={{ marginTop: -2 }} />
      {tabComponents[activeTab]}
    </Box>
  );
};

export default RequestBuilder;
