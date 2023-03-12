import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Mode, NoteKey } from '../../model';
import NoteDisplay from './NoteDisplay';
import NoteEditor from './NoteEditor';

interface Props {
  note: NoteKey | undefined;
  mode: Mode | undefined;
}

const NotePane = ({ note, mode }: Props) => {
  const [content, setContent] = useState<string | undefined>(undefined);

  const doSave = useDebouncedCallback((noteToSave: NoteKey, newContent: string) => {
    window.electron.saveNote(noteToSave.folder, noteToSave.note, newContent);
  }, 1000);

  useEffect(() => {
    if (note) {
      const fetchNote = async () => {
        const markdown = await window.electron.fetchNote(note.folder, note.note);
        setContent(markdown);
        window.scrollTo(0, 0);
      };
      fetchNote();
    }
    return () => {
      doSave.flush();
      setContent(undefined);
    };
  }, [note, doSave]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (note && newContent) {
      doSave(note, newContent);
    }
  };

  if (note) {
    switch (mode) {
      case 'view':
        return <NoteDisplay markdown={content} />;
      case 'edit':
        return <NoteEditor markdown={content} onChange={handleContentChange} />;
      default:
        return <></>;
    }
  } else {
    return <></>;
  }
};

export default NotePane;
