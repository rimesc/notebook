/* eslint no-console: off */
import { Drawer, List, ListSubheader } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { NoteKey } from '../../model';
import { draggable, notDraggable } from '../../util/draggable';
import SideBarFolder from './SidebarFolder';
import SideBarNote from './SidebarNote';

interface Props {
  /** Width of the sidebar, in pixels */
  width: number;
  workspace: string | undefined;
  selected: NoteKey | undefined;
  onSelect: (note: NoteKey) => void;
}

const { electron } = window;

/**
 * Sidebar displaying a list of collapsible folders with their files.
 */
const Sidebar = ({ width, workspace, selected, onSelect }: Props) => {
  const [folders, setFolders] = useState<string[] | undefined>(undefined);
  const [open, setOpen] = useState<string | undefined>(undefined);
  const [notes, dispatch] = useReducer(
    (f: { [folder: string]: string[] | undefined }, action: { folder: string; notes: string[] }) => {
      const newState = { ...f };
      newState[action.folder] = action.notes;
      return newState;
    },
    {}
  );

  // Fetch list of folders when changing workspace.
  useEffect(() => {
    setFolders([]);
    electron.listFolders().then(setFolders).catch(console.log);
  }, [workspace]);

  // Fetch list of notes for a folder when the folder is opened for the first time.
  useEffect(() => {
    if (open && !(open in notes)) {
      electron
        .listNotes(open)
        .then((n) => dispatch({ folder: open, notes: n }))
        .catch(console.log);
    }
  }, [notes, open]);

  // Display modal dialog to choose a name when 'New Note...' menu item is triggered.
  useEffect(() =>
    electron.onMenuCommandNewNote((folder) => {
      // If the command is triggered from the main menu, target the currently open folder (if any).
      const targetFolder = folder ?? open;
      if (targetFolder) {
        electron.showDialog('create-note', targetFolder);
      }
    })
  );

  // Display modal dialog to choose a name when 'New Folder...' menu item is triggered.
  useEffect(() => electron.onMenuCommandNewFolder(() => electron.showDialog('create-folder')));

  // Display modal dialog to choose a new name when 'Rename...' menu item is triggered on a note.
  useEffect(() => electron.onMenuCommandRenameNote((folder, note) => electron.showDialog('rename-note', folder, note)));

  // Refresh list of folders when a new folder has been created.
  useEffect(() =>
    electron.onCreatedFolder((folder) => {
      electron
        .listFolders()
        .then(setFolders)
        .then(() => setOpen(folder))
        .catch(console.log);
    })
  );

  // Refresh list of notes for the affected folder when a new note has been created and select the new note.
  useEffect(() =>
    electron.onCreatedNote((folder, note) => {
      electron
        .listNotes(folder)
        .then((n) => dispatch({ folder, notes: n }))
        .then(() => {
          setOpen(folder);
          return onSelect({ folder, note });
        })
        .catch(console.log);
    })
  );

  // Refresh list of notes for the affected folder when a note has been renamed.
  useEffect(() => {
    return electron.onRenamedNote((folder) => {
      electron
        .listNotes(folder)
        .then((n) => dispatch({ folder, notes: n }))
        .catch(console.log);
    });
  });

  const handleFolderClick = (folder: string) => {
    setOpen(open !== folder ? folder : undefined);
  };

  const handleFolderMenu = (folder: string) => {
    electron.showFolderMenu(folder);
  };

  const handleNoteClick = (folder: string, note: string) => {
    if (!selected || selected.folder !== folder || selected.note !== note) {
      onSelect({ folder, note });
    }
  };

  const handleNoteMenu = (folder: string, note: string) => {
    electron.showNoteMenu(folder, note);
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
            folders.map((folder) => {
              return (
                <SideBarFolder
                  key={folder}
                  name={folder}
                  open={open === folder}
                  onToggle={() => handleFolderClick(folder)}
                  onContextMenu={() => handleFolderMenu(folder)}
                >
                  {notes[folder]?.map((note) => (
                    <SideBarNote
                      key={note}
                      name={note}
                      selected={note === selected?.note}
                      onSelect={() => handleNoteClick(folder, note)}
                      onContextMenu={() => handleNoteMenu(folder, note)}
                    />
                  ))}
                </SideBarFolder>
              );
            })}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
