import { Edit, EditOff } from '@mui/icons-material';
import { Box, IconButton, Toolbar } from '@mui/material';
import React from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NoteDisplay from './components/NoteDisplay';
import Sidebar from './components/Sidebar';
import { NoteKey } from './model';

const drawerWidth = 240;

const Hello = () => {
  const [selected, setSelected] = React.useState<NoteKey | undefined>(undefined);
  const [mode, setMode] = React.useState<'edit' | 'view'>('view');

  const toggleMode = () => setMode(mode === 'view' ? 'edit' : 'view');

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} selected={selected} onSelect={setSelected} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label={mode === 'view' ? 'Edit' : 'View'}
            sx={{ ml: 2 }}
            disabled={!selected}
            onClick={toggleMode}
          >
            {mode === 'view' ? <Edit /> : <EditOff />}
          </IconButton>
        </Toolbar>
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0 }}>
          <NoteDisplay note={selected} />
        </Box>
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
