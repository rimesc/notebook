/* eslint no-console: off */
import { ExpandLess, ExpandMore, Folder } from '@mui/icons-material';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { Fragment } from 'react';
import SideBarNote from './SidebarNote';

interface Props {
  name: string;
  open: boolean;
  selected: string | undefined;
  onSelect: () => void;
  onSelectNote: (note: string) => void;
}

/**
 * Displays a folder with a collapsible list of notes for the sidebar.
 */
const SideBarFolder = ({ name, open, selected, onSelect, onSelectNote }: Props) => {
  const [files, setFiles] = React.useState<string[] | undefined>(undefined);

  React.useEffect(() => {
    if (open && !files) {
      window.electron.listNotes(name).then(setFiles).catch(console.log);
    }
  }, [files, name, open]);

  const handleFolderClick = () => {
    onSelect();
  };

  const handleNoteClick = (note: string) => {
    if (!selected || selected !== note) {
      onSelectNote(note);
    }
  };

  return (
    <Fragment key={name}>
      <ListItem key={name} disablePadding>
        <ListItemButton onClick={handleFolderClick}>
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary={name} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse key={`${name}-contents`} in={open} timeout="auto" unmountOnExit>
        <List dense component="div" disablePadding>
          {(files || []).map((text) => (
            <SideBarNote
              key={text}
              name={text}
              selected={selected !== undefined && text === selected}
              onSelect={() => handleNoteClick(text)}
            />
          ))}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default SideBarFolder;
