import { Box } from '@mui/material';
import React from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NoteDisplay from './components/NoteDisplay';
import Sidebar from './components/Sidebar';
import { NoteKey } from './model';

const drawerWidth = 240;

const Hello = () => {
  const [selected, setSelected] = React.useState<NoteKey | undefined>(undefined);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} selected={selected} onSelect={setSelected} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <NoteDisplay note={selected} />
      </Box>
    </Box>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
