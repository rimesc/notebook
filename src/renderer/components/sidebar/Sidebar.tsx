/* eslint no-console: off */
import { Drawer, List, ListSubheader } from '@mui/material';
import React, { useEffect } from 'react';
import { NoteKey } from '../../model';
import { draggable, notDraggable } from '../../util/draggable';
import SideBarFolder from './SidebarFolder';

interface Props {
  /** Width of the sidebar, in pixels */
  width: number;
  workspace: string | undefined;
  selected: NoteKey | undefined;
  onSelect: (note: NoteKey) => void;
}

/**
 * Sidebar displaying a list of collapsible folders with their files.
 */
const Sidebar = ({ width, workspace, selected, onSelect }: Props) => {
  const [folders, setFolders] = React.useState<string[] | undefined>(undefined);
  const [open, setOpen] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    setFolders([]);
    window.electron.listFolders().then(setFolders).catch(console.log);
  }, [workspace]);

  const handleFolderClick = (folder: string) => {
    setOpen(open !== folder ? folder : undefined);
  };

  const handleFolderMenu = (folder: string) => {
    window.electron.showFolderMenu(folder);
  };

  const handleNoteClick = (folder: string, note: string) => {
    if (!selected || selected.folder !== folder || selected.note !== note) {
      onSelect({ folder, note });
    }
  };

  return (
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
                onFolderContextMenu={() => handleFolderMenu(folder)}
              />
            ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
