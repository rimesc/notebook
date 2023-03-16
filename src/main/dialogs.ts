import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';

const commonWindowOptions: BrowserWindowConstructorOptions = {
  modal: true,
  titleBarStyle: 'hidden',
  show: false,
  resizable: false,
  webPreferences: {
    preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    devTools: false,
  },
};

interface Options {
  width: number;
  height: number;
  parent: BrowserWindow;
}

function show(id: string, options: Options, ...args: unknown[]): void {
  const modal = new BrowserWindow({ ...commonWindowOptions, ...options });
  modal.loadURL(resolveHtmlPath('index.html', `/${id}`));
  modal.on('ready-to-show', () => {
    modal.webContents.send(`dialogs:${id}:init`, ...args);
    ipcMain.once(`dialogs:${id}:done`, () => modal.close());
    modal.show();
  });
}

export default show;
