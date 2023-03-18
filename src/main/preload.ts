import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'list-folders'
  | 'list-notes'
  | 'switched-workspace'
  | 'created-folder'
  | 'created-note'
  | 'dialogs:create-note:init'
  | 'dialogs:create-note:done'
  | 'dialogs:create-folder:done';

function on(channel: Channels, func: (...args: unknown[]) => void): () => void {
  const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
  ipcRenderer.on(channel, subscription);

  return () => {
    ipcRenderer.removeListener(channel, subscription);
  };
}

const electronHandler = {
  getWorkspace: () => ipcRenderer.invoke('get-workspace') as Promise<string>,
  listFolders: () => ipcRenderer.invoke('list-folders') as Promise<string[]>,
  listNotes: (folder: string) => ipcRenderer.invoke('list-notes', folder) as Promise<string[]>,
  fetchNote: (folder: string, note: string) => ipcRenderer.invoke('fetch-note', folder, note) as Promise<string>,

  saveNote: (folder: string, note: string, content: string) => ipcRenderer.send('save-note', folder, note, content),
  showFolderMenu: (folder: string) => ipcRenderer.send('show-folder-menu', folder),

  onSwitchedWorkspace: (func: (workspace: string) => void) =>
    on('switched-workspace', (workspace) => func(workspace as string)),
  onCreatedFolder: (func: (folder: string) => void) => on('created-folder', (folder) => func(folder as string)),
  onCreatedNote: (func: (folder: string, note: string) => void) =>
    on('created-note', (folder, note) => func(folder as string, note as string)),
  onInitCreateNoteDialog: (func: (folder: string) => void) =>
    on('dialogs:create-note:init', (folder) => func(folder as string)),

  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
