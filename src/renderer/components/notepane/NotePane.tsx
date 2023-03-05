import { Article, Edit } from '@mui/icons-material';
import { AppBar, Box, styled, ToggleButton, ToggleButtonGroup, Toolbar, useTheme } from '@mui/material';
import React, { useRef } from 'react';
import { NoteKey } from '../../model';
import { draggable, notDraggable } from '../../util/draggable';
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
  const offsetRef = useRef<HTMLDivElement>(null);
  const Offset = styled('div')(({ theme: t }) => t.mixins.toolbar);

  return (
    <Box sx={{ width, height: '100vh' }}>
      <AppBar
        color="default"
        position="fixed"
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, boxShadow: 'none', ...draggable }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <ToggleButtonGroup
            color="primary"
            size="small"
            exclusive
            value={note && mode}
            onChange={handleModeChange}
            disabled={!note}
            sx={{ ...notDraggable }}
          >
            <ToggleButton value="view" aria-label="view">
              <Article />
            </ToggleButton>
            <ToggleButton value="edit" aria-label="edit">
              <Edit />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
      <Offset ref={offsetRef} />
      <Box
        component="main"
        sx={{ height: offsetRef.current ? `calc(100% - ${offsetRef.current.clientHeight}px)` : '100%' }}
      >
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
