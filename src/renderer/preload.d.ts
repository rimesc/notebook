import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      listFolders: () => Promise<string[]>;
      listFiles: (folder: string) => Promise<string[]>;
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
