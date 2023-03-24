/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, Event, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import showDialog from './dialogs';
import {
  createFolder,
  createNote,
  deleteFolder,
  deleteNote,
  fetchNote,
  listFolders,
  listNotes,
  renameFolder,
  renameNote,
  saveNote,
} from './files';
import MenuBuilder, { folderMenu, noteMenu } from './menu';
import applicationState from './state';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

/* eslint-disable @typescript-eslint/no-explicit-any */
const errorAwareAsyncHandler =
  (listener: (event: Event, ...args: any[]) => Promise<any>) =>
  async (event: Event, ...args: any[]) => {
    try {
      return await listener(event, ...args);
    } catch (error) {
      mainWindow?.webContents.send('error', error instanceof Error ? error.message : `${error}`);
      throw error;
    }
  };
/* eslint-enable @typescript-eslint/no-explicit-any */

ipcMain.handle('get-workspace', () => applicationState.workspace);
ipcMain.handle('list-folders', errorAwareAsyncHandler(listFolders));
ipcMain.handle(
  'list-notes',
  errorAwareAsyncHandler((_, folder) => listNotes(folder))
);
ipcMain.handle(
  'fetch-note',
  errorAwareAsyncHandler((_, folder, note) => fetchNote(folder, note))
);
ipcMain.on(
  'save-note',
  errorAwareAsyncHandler((_, folder, note, content) => saveNote(folder, note, content))
);
ipcMain.on(
  'create-note',
  errorAwareAsyncHandler(async (_, folder, note) => {
    if (folder && note) {
      await createNote(folder, note);
      mainWindow?.webContents.send('created-note', folder, note);
    }
  })
);
ipcMain.on(
  'rename-note',
  errorAwareAsyncHandler(async (_, folder, note, newName) => {
    if (folder && note && newName) {
      await renameNote(folder, note, newName);
      mainWindow?.webContents.send('renamed-note', folder, newName);
    }
  })
);
ipcMain.on(
  'delete-note',
  errorAwareAsyncHandler(async (_, folder, note) => {
    if (folder && note) {
      await deleteNote(folder, note);
      mainWindow?.webContents.send('deleted-note', folder, note);
    }
  })
);
ipcMain.on(
  'create-folder',
  errorAwareAsyncHandler(async (_, folder) => {
    if (folder) {
      await createFolder(folder);
      mainWindow?.webContents.send('created-folder', folder);
    }
  })
);
ipcMain.on(
  'rename-folder',
  errorAwareAsyncHandler(async (_, folder, newName) => {
    if (folder && newName) {
      await renameFolder(folder, newName);
      mainWindow?.webContents.send('renamed-folder', newName);
    }
  })
);
ipcMain.on(
  'delete-folder',
  errorAwareAsyncHandler(async (_, folder) => {
    if (folder) {
      await deleteFolder(folder);
      mainWindow?.webContents.send('deleted-folder', folder);
    }
  })
);
ipcMain.on('show-folder-menu', (_, folder) => {
  if (mainWindow) {
    folderMenu(folder, mainWindow).popup({ window: mainWindow });
  }
});
ipcMain.on('show-note-menu', (_, folder, note) => {
  if (mainWindow) {
    noteMenu(folder, note, mainWindow).popup({ window: mainWindow });
  }
});
ipcMain.on('show-dialog', (_, dialog, style, ...args) => {
  if (mainWindow) {
    showDialog(dialog, { style, parent: mainWindow }, ...args);
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(log.error);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    show: false,
    width: 1280,
    height: 960,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (e, url) => {
    shell.openExternal(url);
    e.preventDefault();
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(log.error);
