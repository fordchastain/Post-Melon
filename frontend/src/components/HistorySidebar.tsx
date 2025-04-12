import { Box, List, ListItemButton, Pagination, styled, TablePagination, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect, useState } from 'react';
import { Request } from '../types/request';
import { getRequests } from '../services/requestServices';
import { getUrlPath } from '../utils/requestUtils';

const SidebarContainer = styled('div')({
  width: 200,
  display: 'flex',
  flexDirection: 'column',
});

interface HistorySidebarProps {
  requestHistory: Request[];
  totalCount: number;
  page: number;
  handlePageChange: (page: number) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ requestHistory, totalCount, page, handlePageChange }) => {
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
      <Pagination
        color="primary"
        count={Math.ceil(totalCount / 10)}
        siblingCount={0}
        boundaryCount={0}
        page={page}
        onChange={(_, newPage) => handlePageChange(newPage)}
      />
    </SidebarContainer>
  );
};

export default HistorySidebar;
