import { Box, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
  placeholder: string;
  validate: (name: string) => boolean | undefined;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const NameChooser = ({ placeholder, validate, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState('');

  // A name can be neither valid nor invalid if, e.g., it is empty. In these cases we don't display an error,
  // but we also don't allow the name to be confirmed.
  const trimmedName = name.trim();
  const isValid = trimmedName ? validate(trimmedName) : undefined;
  const isInvalid = isValid === false;

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'Enter':
        if (isValid) {
          onSubmit(trimmedName);
        }
        break;
      case 'Escape':
        onCancel();
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'end',
        height: '100vh',
        width: 1,
        boxSizing: 'border-box',
      }}
    >
      <TextField
        variant="standard"
        value={name}
        placeholder={placeholder}
        fullWidth
        autoFocus
        error={isInvalid}
        helperText={isInvalid ? 'Please choose a unique name' : "Press 'Enter' to confirm or 'Escape' to cancel"}
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyUp={(e) => handleKeyPress(e.key)}
      />
    </Box>
  );
};

export default NameChooser;
