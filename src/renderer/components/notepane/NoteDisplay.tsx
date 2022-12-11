import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
import furigana from 'furigana-markdown-it';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import './NoteDisplay.css';

interface Props {
  markdown: string | undefined;
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
const NoteDisplay = ({ markdown }: Props) => {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        {
          // eslint-disable-next-line react/no-danger
          markdown ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(markdown)) }} /> : <></>
        }
      </Box>
    </Box>
  );
};

export default NoteDisplay;
