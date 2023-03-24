import { Box, Button, Typography } from '@mui/material';

interface Props {
  title: string;
  /** Text to use for the confirm button. */
  action?: string;
  /** Display the confirm button using the 'danger' colour. */
  danger?: boolean;
  onConfirm: () => void;
}

/**
 * Dialog that requests confirmation for an action.
 */
export default function ConfirmationDialog({ title, action = 'OK', danger = false, onConfirm }: Props) {
  const handleConfirm = () => {
    onConfirm();
    window.electron.closeDialog();
  };

  return (
    <Box
      sx={{
        p: 2,
        height: '100vh',
        width: 1,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          alignItems: 'center',
        }}
      >
        <Typography component="h2" variant="h6" sx={{ textAlign: 'center', overflow: 'hidden' }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Button onClick={window.electron.closeDialog}>Cancel</Button>
        <Button color={danger ? 'error' : 'primary'} onClick={handleConfirm}>
          {action}
        </Button>
      </Box>
    </Box>
  );
}
