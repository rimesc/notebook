/* eslint no-console: off */
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { marked } from 'marked';
import React from 'react';
import { NoteKey } from '../model';
import './NoteDisplay.css';

interface Props {
  note: NoteKey | undefined;
}

marked.setOptions({
  highlight: (code, lang) => {
    const result = hljs.highlight(lang, code);
    if (result.errorRaised) {
      throw result.errorRaised;
    }
    return result.value;
  },
  langPrefix: 'hljs language-',
});

/**
 * Displays a formatted note.
 */
const NoteDisplay = ({ note }: Props) => {
  const [content, setContent] = React.useState<string | undefined>(undefined);

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

  // eslint-disable-next-line react/no-danger
  return content ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(content)) }} /> : <></>;
};

export default NoteDisplay;
