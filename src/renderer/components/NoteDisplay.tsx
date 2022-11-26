/* eslint no-console: off */
import DOMPurify from 'dompurify';
import { marked } from 'marked';
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

  // eslint-disable-next-line react/no-danger
  return content ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(content)) }} /> : <></>;
};

export default NoteDisplay;
