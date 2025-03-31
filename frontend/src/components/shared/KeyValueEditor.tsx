import { Stack, Box, TextField, IconButton, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { KeyValue } from '../../types/request';

type KeyValueEditorProps = {
  items: KeyValue[];
  updateItems: (newItems: KeyValue[]) => void;
};

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ items, updateItems }) => {
  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateItems(updated);

    const last = updated[updated.length - 1];
    if (last.key !== '' || last.value !== '') {
      updateItems([...updated, { key: '', value: '' }]);
    }
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    if (updated.length === 0) {
      updateItems([{ key: '', value: '' }]);
    } else {
      updateItems(updated);
    }
  };

  const handleAdd = () => {
    updateItems([...items, { key: '', value: '' }]);
  };

  return (
    <Stack spacing={1}>
      <Box display="flex" gap={1} px={0.5}>
        <Box flex={0.35}>
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            Key
          </Typography>
        </Box>
        <Box flex={0.65}>
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            Value
          </Typography>
        </Box>
        <Box width={40} />
      </Box>
      {items.map((item, index) => (
        <Box key={index} display="flex" gap={1}>
          <Box flex={0.35}>
            <TextField
              value={item.key}
              onChange={(e) => handleChange(index, 'key', e.target.value)}
              size="small"
              fullWidth
            />
          </Box>
          <Box flex={0.65}>
            <TextField
              value={item.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
              size="small"
              fullWidth
            />
          </Box>
          <IconButton onClick={() => handleRemove(index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box>
        <Button onClick={handleAdd} variant="outlined" size="small">
          Add
        </Button>
      </Box>
    </Stack>
  );
};

export default KeyValueEditor;
