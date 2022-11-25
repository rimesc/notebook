import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'list-folders' | 'list-notes';

contextBridge.exposeInMainWorld('electron', {
  listFolders: () => ipcRenderer.invoke('list-folders') as Promise<string[]>,
  listFiles: (folder: string) =>
    ipcRenderer.invoke('list-notes', folder) as Promise<string[]>,
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
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
