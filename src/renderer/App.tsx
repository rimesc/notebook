/* eslint-disable no-console */
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NotePane from './components/notepane/NotePane';
import Sidebar from './components/sidebar/Sidebar';
import { NoteKey } from './model';

const drawerWidth = 240;

const MainView = () => {
  const [workspace, setWorkspace] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<NoteKey | undefined>(undefined);

  useEffect(() => {
    window.electron.getWorkspace().then(setWorkspace).catch(console.log);
    return window.electron.ipcRenderer.on('switched-workspace', (newWorkspace) => {
      setSelected(undefined);
      setWorkspace(newWorkspace as string);
    });
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} workspace={workspace} selected={selected} onSelect={setSelected} />
      <NotePane width={`calc(100% - ${drawerWidth}px)`} note={selected} />
    </Box>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
      </Routes>
    </Router>
  );
}
