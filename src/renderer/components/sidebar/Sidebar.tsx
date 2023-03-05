/* eslint no-console: off */
import { Box, Drawer, List, ListSubheader } from '@mui/material';
import React from 'react';
import { NoteKey } from '../../model';
import { draggable, notDraggable } from '../../util/draggable';
import SideBarFolder from './SidebarFolder';

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
    (f: { [folder: string]: string[] }, action: { folder: string; files: string[] }) => {
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
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }} aria-label="Folders">
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width,
            ...draggable,
          },
          '& .MuiListItemIcon-root': {
            minWidth: 36,
          },
        }}
        open
      >
        <div style={{ marginTop: 30, height: 'calc(100% - 30px)', ...notDraggable }}>
          <List
            dense
            subheader={
              <ListSubheader component="div" id="nested-list-subheader" sx={{ userSelect: 'none' }}>
                Folders
              </ListSubheader>
            }
          >
            {folders &&
              folders.map((folder) => (
                <SideBarFolder
                  key={folder}
                  name={folder}
                  open={open === folder}
                  selected={selected && folder === selected.folder ? selected.note : undefined}
                  onSelect={() => handleFolderClick(folder)}
                  onSelectNote={(note) => handleNoteClick(folder, note)}
                />
              ))}
          </List>
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
