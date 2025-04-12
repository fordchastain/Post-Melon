import { Box, List, ListItemButton, styled, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect, useState } from 'react';
import { HttpMethod, Request } from '../types/request';
import { getRequests } from '../services/requestServices';
import { getUrlPath } from '../utils/requestUtils';
import GetAppIcon from '@mui/icons-material/Download';

const SidebarContainer = styled('div')({
  width: 200,
  display: 'flex',
  flexDirection: 'column',
});

const LIMIT = 10;

const HistorySidebar: React.FC = () => {
  const [requestHistory, setRequestHistory] = useState<Request[]>([]);
  const [offset, setOffset] = useState<number>(0);

  const methodIconMap: Record<HttpMethod, any> = {
    GET: <GetAppIcon color="primary" />,
    POST: <GetAppIcon color="success" />,
    PUT: <GetAppIcon color="warning" />,
    PATCH: <GetAppIcon color="info" />,
    DELETE: <GetAppIcon color="error" />,
  };

  useEffect(() => {
    getRequests(LIMIT, offset).then((x) => {
      console.log(x);
      setRequestHistory(x);
    });
  }, [offset]);

  return (
    <SidebarContainer>
      <Box p={2}>
        <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={2}>
          <AccessTimeIcon fontSize="small" />
          History
        </Typography>
        <List dense>
          {requestHistory.map((x, index) => (
            <ListItemButton key={index}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
                noWrap
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  textAlign: 'left',
                  marginLeft: '4px',
                }}
              >
                {`${x.method} ${getUrlPath(x.url.toString())}`}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </SidebarContainer>
  );
};

export default HistorySidebar;
