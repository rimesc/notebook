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

interface Props {
  /** Width of the sidebar, in pixels */
  width: number;
}

/**
 * Sidebar displaying a list of collapsible folders with their files.
 */
const Sidebar = ({ width }: Props) => {
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

  window.electron.ipcRenderer.once('list-folders', (f) => {
    setFolders(f as string[]);
  });
  window.electron.ipcRenderer.once('list-files', (f, ff) => {
    dispatch({ folder: f as string, files: ff as string[] });
  });

  if (folders === undefined) {
    window.electron.ipcRenderer.sendMessage('list-folders', []);
  }
  if (open !== undefined && !(open in files)) {
    window.electron.ipcRenderer.sendMessage('list-files', [open]);
  }

  const handleClick = (item: string) => {
    setOpen(open !== item ? item : undefined);
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
          <List dense>
            <ListSubheader component="div" id="nested-list-subheader">
              Folders
            </ListSubheader>
            {folders &&
              folders.map((folder) => (
                <>
                  <ListItem key={folder} disablePadding>
                    <ListItemButton onClick={() => handleClick(folder)}>
                      <ListItemIcon>
                        <Folder />
                      </ListItemIcon>
                      <ListItemText primary={folder} />
                      {open === folder ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open === folder} timeout="auto" unmountOnExit>
                    <List dense component="div" disablePadding>
                      {(files[folder] || []).map((text) => (
                        <ListItem key={text} disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <Article />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ))}
          </List>
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
