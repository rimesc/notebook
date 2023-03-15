/* eslint no-console: off */
import { ExpandLess, ExpandMore, Folder } from '@mui/icons-material';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { Fragment, MouseEvent, useEffect } from 'react';
import SideBarNote from './SidebarNote';

interface Props {
  name: string;
  open: boolean;
  selected: string | undefined;
  onSelect: () => void;
  onSelectNote: (note: string) => void;
  onFolderContextMenu: () => void;
}

/**
 * Displays a folder with a collapsible list of notes for the sidebar.
 */
const SideBarFolder = ({ name, open, selected, onSelect, onSelectNote, onFolderContextMenu }: Props) => {
  const [files, setFiles] = React.useState<string[] | undefined>(undefined);

  useEffect(() => {
    if (open && !files) {
      window.electron.listNotes(name).then(setFiles).catch(console.log);
    }
  }, [files, name, open]);

  useEffect(() => {
    return window.electron.ipcRenderer.on('created-note', (folder, note) => {
      if (folder === name) {
        window.electron
          .listNotes(folder as string)
          .then(setFiles)
          .then(() => {
            if (!open) {
              onSelect();
            }
            return onSelectNote(note as string);
          })
          .catch(console.log);
      }
    });
  });

  const handleFolderClick = () => {
    onSelect();
  };

  const handleNoteClick = (note: string) => {
    if (!selected || selected !== note) {
      onSelectNote(note);
    }
  };

  const handleFolderAuxClick = (e: MouseEvent<HTMLDivElement> | undefined) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onFolderContextMenu();
  };

  return (
    <Fragment key={name}>
      <ListItem key={name} disablePadding>
        <ListItemButton onClick={handleFolderClick} onAuxClick={handleFolderAuxClick}>
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
