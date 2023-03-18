/* eslint no-console: off */
import { Article } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { MouseEvent } from 'react';

interface Props {
  name: string;
  selected: boolean;
  onSelect: () => void;
  onContextMenu: () => void;
}

/**
 * Displays a note for the sidebar.
 */
const SideBarNote = ({ name, selected, onSelect, onContextMenu }: Props) => {
  const handleClick = () => {
    if (!selected) {
      onSelect();
    }
  };

  const handleAuxClick = (e: MouseEvent<HTMLDivElement> | undefined) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onContextMenu();
  };

  return (
    <ListItem key={name} disablePadding>
      <ListItemButton selected={selected} sx={{ pl: 4 }} onClick={handleClick} onAuxClick={handleAuxClick}>
        <ListItemIcon>
          <Article />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
};

export default SideBarNote;
