import { Box } from '@mui/material';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Sidebar from './components/Sidebar';

const drawerWidth = 240;

const files = {
  'Folder One': ['File 1', 'File 2', 'File 3'],
  'Folder Two': ['File 4', 'File 5'],
} as { [folder: string]: string[] };

const Hello = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        width={drawerWidth}
        folders={Object.keys(files)}
        fetchFiles={(folder) => files[folder]}
      />
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
            <a
              href="https://electron-react-boilerplate.js.org/"
              target="_blank"
              rel="noreferrer"
            >
              <button type="button">
                <span role="img" aria-label="books">
                  📚
                </span>
                Read our docs
              </button>
            </a>
            <a
              href="https://github.com/sponsors/electron-react-boilerplate"
              target="_blank"
              rel="noreferrer"
            >
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
