import { Box } from '@mui/material';
import React from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NotePane from './components/notepane/NotePane';
import Sidebar from './components/sidebar/Sidebar';
import { NoteKey } from './model';

const drawerWidth = 240;

const MainView = () => {
  const [selected, setSelected] = React.useState<NoteKey | undefined>(undefined);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} selected={selected} onSelect={setSelected} />
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
