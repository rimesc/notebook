import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, IpcMainEvent } from 'electron';
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

export type DialogStyle = 'question' | 'textInput';

interface DialogOptions {
  style: DialogStyle;
  parent: BrowserWindow;
}

const styles: { [style in DialogStyle]: BrowserWindowConstructorOptions } = {
  question: { width: 360, height: 180 },
  textInput: { width: 480, height: 128 },
};

function show(id: string, options: DialogOptions, ...args: unknown[]): void {
  const { style, parent } = options;
  const modal = new BrowserWindow({ ...commonWindowOptions, ...styles[style], parent });
  modal.loadURL(resolveHtmlPath('index.html', `/${id}`));
  modal.on('ready-to-show', () => {
    modal.webContents.send(`init-dialog`, ...args);
    const closeDialog = ({ sender }: IpcMainEvent) => {
      if (sender === modal.webContents) {
        modal.close();
      }
    };
    modal.on('close', () => ipcMain.removeListener(`close-dialog`, closeDialog));
    ipcMain.on(`close-dialog`, closeDialog);
    modal.show();
  });
}

export default show;
