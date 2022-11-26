import { Box } from '@mui/material';
import React from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import { NoteKey } from './model';

const drawerWidth = 240;

const Hello = () => {
  const [selected, setSelected] = React.useState<NoteKey | undefined>(undefined);

  React.useEffect(() => {
    if (selected) {
      const fetchNote = async () => {
        console.log(await window.electron.fetchNote(selected.folder, selected.note));
      };

      fetchNote();
    }
  }, [selected]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} selected={selected} onSelect={setSelected} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <div>
          <div className="Hello">
            <img width="200" alt="icon" src={icon} />
          </div>
          <h1>electron-react-boilerplate</h1>
          <div className="Hello">
            <a href="https://electron-react-boilerplate.js.org/" target="_blank" rel="noreferrer">
              <button type="button">
                <span role="img" aria-label="books">
                  📚
                </span>
                Read our docs
              </button>
            </a>
            <a href="https://github.com/sponsors/electron-react-boilerplate" target="_blank" rel="noreferrer">
              <button type="button">
                <span role="img" aria-label="folded hands">
                  🙏
                </span>
                Donate
              </button>
            </a>
          </div>
        </div>
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
