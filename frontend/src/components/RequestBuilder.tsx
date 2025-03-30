import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import RequestEditor from './RequestEditor';
import { HttpMethod, RequestTab } from '../types/request';
import RequestTabs from './RequestTabs';

const RequestBuilder: React.FC = () => {
  const [requestMethod, setRequestMethod] = useState<HttpMethod>('GET');
  const [requestUrl, setRequestUrl] = useState('');
  const [activeTab, setActiveTab] = useState<RequestTab>('params');

  const handleSendRequest = () => {};

  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      <Typography
        variant="h5"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ marginBottom: -1 }}
      >
        <img
          src="/post-melon-logo.png"
          alt="Post Melon logo"
          style={{ height: '40px' }}
        />
        Post Melon
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
    </Box>
  );
};

export default RequestBuilder;
