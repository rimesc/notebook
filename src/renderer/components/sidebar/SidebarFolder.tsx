/* eslint no-console: off */
import { ExpandLess, ExpandMore, Folder } from '@mui/icons-material';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Fragment, MouseEvent, ReactNode } from 'react';

interface Props {
  name: string;
  open: boolean;
  onToggle: () => void;
  onContextMenu: () => void;
  children?: ReactNode | undefined;
}

/**
 * Displays a folder with a collapsible list of notes for the sidebar.
 */
const SidebarFolder = ({ name, open, onToggle, onContextMenu, children = undefined }: Props) => {
  const handleFolderAuxClick = (e: MouseEvent<HTMLDivElement> | undefined) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onContextMenu();
  };

  return (
    <Fragment key={name}>
      <ListItem key={name} disablePadding>
        <ListItemButton onClick={onToggle} onAuxClick={handleFolderAuxClick}>
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary={name} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse key={`${name}-contents`} in={open} timeout="auto" unmountOnExit>
        <List dense component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default SidebarFolder;
