import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
import furigana from 'furigana-markdown-it';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import deflist from 'markdown-it-deflist';
import footnote from 'markdown-it-footnote';
import './Viewer.css';

interface Props {
  markdown: string | undefined;
}

const md = new MarkdownIt({
  typographer: true,
  highlight: (code, lang) => {
    if (!lang) {
      return code;
    }
    const result = hljs.highlight(lang, code);
    if (result.errorRaised) {
      throw result.errorRaised;
    }
    return result.value;
  },
  langPrefix: 'hljs language-',
})
  .use(deflist)
  .use(footnote)
  .use(container, 'info')
  .use(container, 'warning')
  .use(container, 'card')
  .use(furigana({}));

/**
 * Displays a formatted note.
 */
export default function Viewer({ markdown }: Props) {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        {
          // eslint-disable-next-line react/no-danger
          markdown ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(markdown)) }} /> : null
        }
      </Box>
    </Box>
  );
}
