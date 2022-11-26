/* eslint no-console: off */
import { Article, ExpandLess, ExpandMore, Folder } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import React from 'react';
import { NoteKey } from '../model';

interface Props {
  /** Width of the sidebar, in pixels */
  width: number;
  selected: NoteKey | undefined;
  onSelect: (note: NoteKey) => void;
}

/**
 * Sidebar displaying a list of collapsible folders with their files.
 */
const Sidebar = ({ width, selected, onSelect }: Props) => {
  const [folders, setFolders] = React.useState<string[] | undefined>(undefined);
  const [open, setOpen] = React.useState<string | undefined>(undefined);
  const [files, dispatch] = React.useReducer(
    (
      f: { [folder: string]: string[] },
      action: { folder: string; files: string[] }
    ) => {
      const newState = { ...f };
      newState[action.folder] = action.files;
      return newState;
    },
    {}
  );

  if (folders === undefined) {
    window.electron.listFolders().then(setFolders).catch(console.log);
  }
  if (open !== undefined && !(open in files)) {
    window.electron
      .listNotes(open)
      .then((f) => dispatch({ folder: open, files: f }))
      .catch(console.log);
  }

  const handleFolderClick = (folder: string) => {
    setOpen(open !== folder ? folder : undefined);
  };

  const handleNoteClick = (folder: string, note: string) => {
    if (!selected || selected.folder !== folder || selected.note !== note) {
      onSelect({ folder, note });
    }
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width,
          },
          '& .MuiListItemIcon-root': {
            minWidth: 36,
          },
        }}
        open
      >
        <div style={{ marginTop: 30 }}>
          <List
            dense
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Folders
              </ListSubheader>
            }
          >
            {folders &&
              folders.map((folder) => [
                <ListItem key={folder} disablePadding>
                  <ListItemButton onClick={() => handleFolderClick(folder)}>
                    <ListItemIcon>
                      <Folder />
                    </ListItemIcon>
                    <ListItemText primary={folder} />
                    {open === folder ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>,
                <Collapse
                  key={`${folder}-contents`}
                  in={open === folder}
                  timeout="auto"
                  unmountOnExit
                >
                  <List dense component="div" disablePadding>
                    {(files[folder] || []).map((text) => (
                      <ListItem key={text} disablePadding>
                        <ListItemButton
                          selected={
                            selected &&
                            folder === selected.folder &&
                            text === selected.note
                          }
                          sx={{ pl: 4 }}
                          onClick={() => handleNoteClick(folder, text)}
                        >
                          <ListItemIcon>
                            <Article />
                          </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>,
              ])}
          </List>
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
