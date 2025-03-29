import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import RequestEditor from './RequestEditor';
import { HttpMethod } from '../types/request';

const RequestBuilder: React.FC = () => {
  const [requestMethod, setRequestMethod] = useState<HttpMethod>('GET');
  const [requestUrl, setRequestUrl] = useState('');

  const handleSendRequest = () => {};

  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      <Typography variant="h5" fontWeight="bold">
        PostMelon <span style={{ fontSize: '1.2em' }}>🍈</span>
      </Typography>
      <Divider />
      <RequestEditor
        requestMethod={requestMethod}
        setRequestMethod={setRequestMethod}
        requestUrl={requestUrl}
        setRequestUrl={setRequestUrl}
        onSend={handleSendRequest}
      />
    </Box>
  );
};

export default RequestBuilder;
