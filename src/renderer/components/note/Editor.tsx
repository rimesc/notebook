import { Box, TextField } from '@mui/material';

interface Props {
  markdown: string | undefined;
  onChange: (markdowm: string) => void;
}

/**
 * Allows editing of a note.
 */
const Editor = ({ markdown, onChange }: Props) => {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 3 }}>
        {markdown ? (
          <TextField
            multiline
            fullWidth
            sx={{
              '& .MuiInputBase-multiline': {
                fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                fontSize: 13,
                padding: 0,
              },
              '& .MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
            }}
            value={markdown}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default Editor;
