import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'list-folders' | 'list-notes';

contextBridge.exposeInMainWorld('electron', {
  listFolders: () => ipcRenderer.invoke('list-folders') as Promise<string[]>,
  listNotes: (folder: string) => ipcRenderer.invoke('list-notes', folder) as Promise<string[]>,
  fetchNote: (folder: string, note: string) => ipcRenderer.invoke('fetch-note', folder, note) as Promise<string>,
  saveNote: (folder: string, note: string, content: string) =>
    ipcRenderer.invoke('save-note', folder, note, content) as Promise<void>,
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
