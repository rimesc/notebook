/* eslint no-console: off */
import { Article } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface Props {
  name: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Displays a note for the sidebar.
 */
const SideBarNote = ({ name, selected, onSelect }: Props) => {
  const handleClick = () => {
    if (!selected) {
      onSelect();
    }
  };

  return (
    <ListItem key={name} disablePadding>
      <ListItemButton selected={selected} sx={{ pl: 4 }} onClick={handleClick}>
        <ListItemIcon>
          <Article />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
};

export default SideBarNote;
