/* eslint no-console: off */
import React from 'react';
import { NoteKey } from '../model';

interface Props {
  note: NoteKey | undefined;
}

/**
 * Displays raw test of a note.
 */
const NoteDisplay = ({ note }: Props) => {
  const [content, setContent] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (note) {
      window.electron.fetchNote(note.folder, note.note).then(setContent).catch(console.log);
    }
  }, [note]);

  return <div>{content}</div>;
};

export default NoteDisplay;
