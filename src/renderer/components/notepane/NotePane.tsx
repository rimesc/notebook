import { Box, styled } from '@mui/material';
import React, { useRef } from 'react';
import { NoteKey } from '../../model';
import AppToolbar from '../toolbar/Toolbar';
import NoteDisplay from './NoteDisplay';
import NoteEditor from './NoteEditor';

interface Props {
  note: NoteKey | undefined;
}
const NotePane = ({ note }: Props) => {
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

  const handleModeChange = (newMode: 'edit' | 'view') => {
    setMode(newMode);
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

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setModified(true);
  };

  const offsetRef = useRef<HTMLDivElement>(null);
  const Offset = styled('div')(({ theme: t }) => t.mixins.toolbar);

  return (
    <>
      <AppToolbar mode={note && mode} onModeChange={handleModeChange} />
      <Offset ref={offsetRef} />
      <Box
        component="main"
        sx={{ height: offsetRef.current ? `calc(100% - ${offsetRef.current.clientHeight}px)` : '100%' }}
      >
        {mode === 'view' ? (
          <NoteDisplay markdown={content} />
        ) : (
          <NoteEditor markdown={content} onChange={handleContentChange} />
        )}
      </Box>
    </>
  );
};

export default NotePane;
