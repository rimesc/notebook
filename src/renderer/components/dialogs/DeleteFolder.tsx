import { Box, Button, Typography } from '@mui/material';
import ellipsize from 'ellipsize';
import { useEffect, useState } from 'react';

export default function DeleteFolder() {
  const [folder, setFolder] = useState<string | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitDeleteFolderDialog((toDelete) => {
      setFolder(toDelete);
    });
  }, []);

  const handleSubmit = () => {
    if (folder) {
      window.electron.deleteFolder(folder);
      window.electron.closeDialog();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        height: '100vh',
        width: 1,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          alignItems: 'center',
        }}
      >
        <Typography component="h2" variant="h6" sx={{ textAlign: 'center', overflow: 'hidden' }}>
          Delete folder &apos;{ellipsize(folder, 50)}&apos;?
        </Typography>
      </Box>
      <Box
        sx={{
          width: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Button onClick={window.electron.closeDialog}>Cancel</Button>
        <Button color="error" onClick={handleSubmit}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}
