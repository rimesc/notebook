import { Edit, EditOff } from '@mui/icons-material';
import { Box, IconButton, Toolbar } from '@mui/material';
import React from 'react';
import { NoteKey } from '../../model';
import NoteDisplay from './NoteDisplay';

interface Props {
  /** Width, in pixels */
  width: number | string;
  note: NoteKey | undefined;
}
const NotePane = ({ width, note }: Props) => {
  const [content, setContent] = React.useState<string | undefined>(undefined);
  const [mode, setMode] = React.useState<'edit' | 'view'>('view');

  React.useEffect(() => {
    if (note) {
      const fetchNote = async () => {
        const markdown = await window.electron.fetchNote(note.folder, note.note);
        setContent(markdown);
        window.scrollTo(0, 0);
      };
      fetchNote();
    }
  }, [note]);

  const toggleMode = () => setMode(mode === 'view' ? 'edit' : 'view');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <IconButton
          edge="end"
          color="inherit"
          aria-label={mode === 'view' ? 'Edit' : 'View'}
          sx={{ ml: 2 }}
          disabled={!note}
          onClick={toggleMode}
        >
          {mode === 'view' ? <Edit /> : <EditOff />}
        </IconButton>
      </Toolbar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0 }}>
        <NoteDisplay markdown={content} />
      </Box>
    </Box>
  );
};

export default NotePane;
