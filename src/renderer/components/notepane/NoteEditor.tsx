import { TextField } from '@mui/material';
import './NoteDisplay.css';

interface Props {
  markdown: string | undefined;
  onChange: (markdowm: string) => void;
}

/**
 * Allows editing of a note.
 */
const NoteEditor = ({ markdown, onChange }: Props) => {
  return markdown ? (
    <TextField
      multiline
      fullWidth
      sx={{
        '& .MuiInputBase-multiline': {
          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
          fontSize: 13,
        },
        '& .MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
      }}
      value={markdown}
      onChange={(event) => onChange(event.target.value)}
    />
  ) : (
    <></>
  );
};

export default NoteEditor;
