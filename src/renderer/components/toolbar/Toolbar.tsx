import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import { AppBar, ToggleButton, ToggleButtonGroup, Toolbar, useTheme } from '@mui/material';
import { Mode } from '../../model';
import { draggable, notDraggable } from '../../util/draggable';

interface Props {
  mode: Mode | undefined;
  onModeChange: (mode: Mode) => void;
}

const AppToolbar = ({ mode, onModeChange: onModeChanged }: Props) => {
  const theme = useTheme();

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: Mode) => {
    if (newMode) {
      onModeChanged(newMode);
    }
  };

  return (
    <AppBar
      color="default"
      position="fixed"
      sx={{ borderBottom: `1px solid ${theme.palette.divider}`, boxShadow: 'none', ...draggable }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ToggleButtonGroup
          color="primary"
          size="small"
          exclusive
          value={mode}
          onChange={handleModeChange}
          disabled={!mode}
          sx={{ ...notDraggable }}
        >
          <ToggleButton value="view" aria-label="view">
            <ArticleIcon />
          </ToggleButton>
          <ToggleButton value="edit" aria-label="edit">
            <EditIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
