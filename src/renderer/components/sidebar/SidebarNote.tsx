/* eslint no-console: off */
import { ArticleOutlined } from '@mui/icons-material';
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
export default function SidebarNote({ name, selected, onSelect, onContextMenu }: Props) {
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
          <ArticleOutlined color="primary" />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}
