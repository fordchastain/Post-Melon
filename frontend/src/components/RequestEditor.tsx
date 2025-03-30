import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { HttpMethod } from '../types/request';

type RequestEditorProps = {
  requestMethod: string;
  setRequestMethod: (method: HttpMethod) => void;
  requestUrl: string;
  setRequestUrl: (url: string) => void;
  onSend: () => void;
};

const RequestEditor: React.FC<RequestEditorProps> = ({
  requestMethod,
  setRequestMethod,
  requestUrl,
  setRequestUrl,
  onSend,
}) => (
  <Box display="flex" gap={0}>
    <Select
      id="request-method-select"
      value={requestMethod}
      onChange={(e) => {
        setRequestMethod(e.target.value as HttpMethod);
      }}
      sx={{
        minWidth: 110,
        fontWeight: 'bold',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        '& .MuiSelect-select': {
          textAlign: 'center',
        },
      }}
      size="medium"
    >
      <MenuItem value="GET">GET</MenuItem>
      <MenuItem value="POST">POST</MenuItem>
      <MenuItem value="PUT">PUT</MenuItem>
      <MenuItem value="Patch">PATCH</MenuItem>
      <MenuItem value="DELETE">DELETE</MenuItem>
    </Select>
    <TextField
      id="request-url-text-field"
      fullWidth
      variant="outlined"
      value={requestUrl}
      onChange={(e) => setRequestUrl(e.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 0,
          backgroundColor: '#fafafa',
        },
      }}
      size="medium"
    />
    <Button
      variant="contained"
      color="primary"
      sx={{
        minWidth: 90,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingX: 3,
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
      size="medium"
    >
      Send
    </Button>
  </Box>
);

export default RequestEditor;
