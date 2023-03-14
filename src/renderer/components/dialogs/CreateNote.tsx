import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const CreateNote = () => {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<string[] | undefined>(undefined);
  const [name, setName] = useState('');

  useEffect(() => {
    return window.electron.ipcRenderer.on('dialogs:create-note:init', (inFolder) => {
      setFolder(inFolder as string);
    });
  }, []);

  useEffect(() => {
    if (folder) {
      window.electron
        .listNotes(folder)
        .then((fs) => setFiles(fs.map((f) => f.toLowerCase())))
        .catch(console.log);
    }
  }, [folder]);

  // A name can be invalid but not conflicting if (a) it is empty or (b) the list of existing files hasn't
  // been fetched yet. In these cases we don't display an error, but we also don't allow the name to be confirmed.
  const isValid = name && files ? !files.includes(name.trim().toLowerCase()) : false;
  const isConflicting = name && files ? !isValid : false;

  const handleEnter = () => {
    if (isValid) {
      window.electron.ipcRenderer.sendMessage('dialogs:create-note:done', folder, name.trim());
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
        fullWidth
        autoFocus
        error={isConflicting}
        helperText={isConflicting ? 'Please choose a unique name' : "Press 'Enter' to confirm or 'Escape' to cancel"}
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyUp={(e) => handleKeyPress(e.key)}
      />
    </Box>
  );
};

export default CreateNote;
