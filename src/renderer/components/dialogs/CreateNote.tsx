import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const CreateNote = () => {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');

  useEffect(
    () =>
      window.electron.ipcRenderer.on('dialogs:create-note:init', (inFolder) => {
        setFolder(inFolder as string);
      }),
    []
  );

  const handleEnter = () => {
    if (folder && name) {
      window.electron.ipcRenderer.sendMessage('dialogs:create-note:done', folder, name);
    }
  };
  const handleEscape = () => window.electron.ipcRenderer.sendMessage('dialogs:create-note:done');
  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'Enter':
        handleEnter();
        break;
      case 'Escape':
        handleEscape();
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'end',
        height: '100vh',
        width: 1,
        boxSizing: 'border-box',
      }}
    >
      <TextField
        variant="standard"
        value={name}
        placeholder="New note"
        helperText="Press 'Enter' to confirm or 'Escape' to cancel"
        fullWidth
        autoFocus
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyUp={(e) => handleKeyPress(e.key)}
      />
    </Box>
  );
};

export default CreateNote;
