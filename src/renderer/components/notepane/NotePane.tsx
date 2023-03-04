import { Article, Edit } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Toolbar, useTheme } from '@mui/material';
import React from 'react';
import { NoteKey } from '../../model';
import NoteDisplay from './NoteDisplay';
import NoteEditor from './NoteEditor';

interface Props {
  /** Width, in pixels */
  width: number | string;
  note: NoteKey | undefined;
}
const NotePane = ({ width, note }: Props) => {
  const [content, setContent] = React.useState<string | undefined>(undefined);
  const [modified, setModified] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<'edit' | 'view'>('view');

  React.useEffect(() => {
    setContent(undefined);
    setModified(false);
    if (note) {
      const fetchNote = async () => {
        const markdown = await window.electron.fetchNote(note.folder, note.note);
        setContent(markdown);
        window.scrollTo(0, 0);
      };
      fetchNote();
    }
  }, [note]);

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'edit' | 'view') => {
    if (newMode) {
      setMode(newMode);
    }
    if (modified) {
      if (note && content) {
        const saveNote = async () => {
          await window.electron.saveNote(note.folder, note.note, content);
          setModified(false);
        };
        saveNote();
      }
    }
  };

  const contentChanged = (newContent: string) => {
    setContent(newContent);
    setModified(true);
  };

  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width, height: '100vh' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'end',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ToggleButtonGroup
          color="primary"
          size="small"
          exclusive
          value={note && mode}
          onChange={handleModeChange}
          disabled={!note}
        >
          <ToggleButton value="view" aria-label="view">
            <Article />
          </ToggleButton>
          <ToggleButton value="edit" aria-label="edit">
            <Edit />
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
      <Box component="main" sx={{ height: '100%' }}>
        {mode === 'view' ? (
          <NoteDisplay markdown={content} />
        ) : (
          <NoteEditor markdown={content} onChange={contentChanged} />
        )}
      </Box>
    </Box>
  );
};

export default NotePane;
