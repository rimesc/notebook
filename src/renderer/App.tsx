/* eslint-disable no-console */
import { Box, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateNote from './components/dialogs/CreateNote';
import NoteDisplay from './components/note/NoteDisplay';
import Sidebar from './components/sidebar/Sidebar';
import AppToolbar from './components/toolbar/Toolbar';
import { NoteKey } from './model';

const drawerWidth = 240;

const MainView = () => {
  const [workspace, setWorkspace] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<NoteKey | undefined>(undefined);
  const [mode, setMode] = useState<'edit' | 'view'>('view');

  useEffect(() => {
    window.electron.getWorkspace().then(setWorkspace).catch(console.log);
    return window.electron.ipcRenderer.on('switched-workspace', (newWorkspace) => {
      setSelected(undefined);
      setWorkspace(newWorkspace as string);
    });
  }, []);

  useEffect(() => {
    return window.electron.ipcRenderer.on('error', console.log);
  }, []);

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

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/new_note" element={<CreateNote />} />
      </Routes>
    </HashRouter>
  );
}
