/* eslint-disable no-console */
import { Box, styled } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateFolder from './components/dialogs/CreateFolder';
import CreateNote from './components/dialogs/CreateNote';
import RenameFolder from './components/dialogs/RenameFolder';
import RenameNote from './components/dialogs/RenameNote';
import NoteDisplay from './components/note/NoteDisplay';
import Sidebar from './components/sidebar/Sidebar';
import AppToolbar from './components/toolbar/Toolbar';
import { NoteKey } from './model';

const drawerWidth = 240;

const MainView = () => {
  const [workspace, setWorkspace] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<NoteKey | undefined>(undefined);
  const [mode, setMode] = useState<'edit' | 'view'>('view');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getWorkspace = async () => {
      setWorkspace(await window.electron.getWorkspace());
    };
    getWorkspace();
  }, []);

  useEffect(
    () =>
      window.electron.onSwitchedWorkspace((newWorkspace) => {
        setSelected(undefined);
        setWorkspace(newWorkspace);
      }),
    []
  );

  useEffect(
    () => window.electron.onError((message) => enqueueSnackbar(message, { variant: 'error' })),
    [enqueueSnackbar]
  );

  const offsetRef = useRef<HTMLDivElement>(null);
  const Offset = styled('div')(({ theme: t }) => t.mixins.toolbar);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="Folders">
        <Sidebar width={drawerWidth} workspace={workspace} selected={selected} onSelect={setSelected} />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }, height: '100vh' }}>
        <AppToolbar mode={selected && mode} onModeChange={setMode} />
        <Offset ref={offsetRef} />
        <Box
          component="main"
          sx={{ height: offsetRef.current ? `calc(100% - ${offsetRef.current.clientHeight}px)` : '100%' }}
        >
          <NoteDisplay note={selected} mode={mode} />
        </Box>
      </Box>
    </Box>
  );
};

const MainViewWithSnackBar = () => {
  return (
    <SnackbarProvider autoHideDuration={10000} maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <MainView />
    </SnackbarProvider>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainViewWithSnackBar />} />
        <Route path="/create-note" element={<CreateNote />} />
        <Route path="/rename-note" element={<RenameNote />} />
        <Route path="/create-folder" element={<CreateFolder />} />
        <Route path="/rename-folder" element={<RenameFolder />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
