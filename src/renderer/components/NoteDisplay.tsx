import DOMPurify from 'dompurify';
import furigana from 'furigana-markdown-it';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import React from 'react';
import { NoteKey } from '../model';
import './NoteDisplay.css';

interface Props {
  note: NoteKey | undefined;
}

const md = new MarkdownIt({
  highlight: (code, lang) => {
    const result = hljs.highlight(lang, code);
    if (result.errorRaised) {
      throw result.errorRaised;
    }
    return result.value;
  },
  langPrefix: 'hljs language-',
}).use(furigana({}));

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
  return content ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(content)) }} /> : <></>;
};

export default NoteDisplay;
