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
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<NoteKey | undefined>(undefined);

  useEffect(() => {
    window.electron
      .rootDirectory()
      .then((newLocation) => {
        return setLocation(newLocation as string);
      })
      .catch(console.log);
    return window.electron.ipcRenderer.on('switched-root-directory', (newLocation) => {
      setSelected(undefined);
      setLocation(newLocation as string);
    });
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} location={location} selected={selected} onSelect={setSelected} />
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
