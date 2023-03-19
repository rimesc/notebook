import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'list-folders'
  | 'list-notes'
  | 'save-note'
  | 'create-folder'
  | 'create-note'
  | 'rename-folder'
  | 'rename-note'
  | 'show-folder-menu'
  | 'show-note-menu'
  | 'switched-workspace'
  | 'created-folder'
  | 'created-note'
  | 'renamed-folder'
  | 'renamed-note'
  | 'show-dialog'
  | 'init-dialog'
  | 'close-dialog'
  | 'menu-command:new-note'
  | 'menu-command:rename-note'
  | 'menu-command:new-folder'
  | 'menu-command:rename-folder';

function on(channel: Channels, func: (...args: unknown[]) => void): () => void {
  const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
  ipcRenderer.on(channel, subscription);

  return () => {
    ipcRenderer.removeListener(channel, subscription);
  };
}

function sendMessage(channel: Channels, ...args: unknown[]) {
  ipcRenderer.send(channel, ...args);
}

const electronHandler = {
  getWorkspace: () => ipcRenderer.invoke('get-workspace') as Promise<string>,
  listFolders: () => ipcRenderer.invoke('list-folders') as Promise<string[]>,
  listNotes: (folder: string) => ipcRenderer.invoke('list-notes', folder) as Promise<string[]>,
  fetchNote: (folder: string, note: string) => ipcRenderer.invoke('fetch-note', folder, note) as Promise<string>,

  createFolder: (folder: string) => sendMessage('create-folder', folder),
  createNote: (folder: string, note: string) => sendMessage('create-note', folder, note),
  renameNote: (folder: string, originalName: string, newName: string) =>
    sendMessage('rename-note', folder, originalName, newName),
  renameFolder: (originalName: string, newName: string) => sendMessage('rename-folder', originalName, newName),
  saveNote: (folder: string, note: string, content: string) => sendMessage('save-note', folder, note, content),
  showFolderMenu: (folder: string) => sendMessage('show-folder-menu', folder),
  showNoteMenu: (folder: string, note: string) => sendMessage('show-note-menu', folder, note),
  showDialog: (id: string, ...args: unknown[]) => sendMessage('show-dialog', id, ...args),
  closeDialog: () => sendMessage('close-dialog'),

  onSwitchedWorkspace: (func: (workspace: string) => void) =>
    on('switched-workspace', (workspace) => func(workspace as string)),
  onCreatedFolder: (func: (folder: string) => void) => on('created-folder', (folder) => func(folder as string)),
  onRenamedFolder: (func: (folder: string) => void) => on('renamed-folder', (folder) => func(folder as string)),
  onCreatedNote: (func: (folder: string, note: string) => void) =>
    on('created-note', (folder, note) => func(folder as string, note as string)),
  onRenamedNote: (func: (folder: string, note: string) => void) =>
    on('renamed-note', (folder, note) => func(folder as string, note as string)),
  onInitCreateNoteDialog: (func: (folder: string) => void) => on('init-dialog', (folder) => func(folder as string)),
  onInitRenameNoteDialog: (func: (folder: string, note: string) => void) =>
    on('init-dialog', (folder, note) => func(folder as string, note as string)),
  onInitRenameFolderDialog: (func: (folder: string) => void) => on('init-dialog', (folder) => func(folder as string)),
  onMenuCommandNewNote: (func: (folder: string) => void) =>
    on('menu-command:new-note', (folder) => func(folder as string)),
  onMenuCommandRenameNote: (func: (folder: string, note: string) => void) =>
    on('menu-command:rename-note', (folder, note) => func(folder as string, note as string)),
  onMenuCommandNewFolder: (func: () => void) => on('menu-command:new-folder', () => func()),
  onMenuCommandRenameFolder: (func: (folder: string) => void) =>
    on('menu-command:rename-folder', (folder) => func(folder as string)),

  ipcRenderer: {
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
