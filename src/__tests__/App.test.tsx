import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { ElectronHandler } from '../main/preload';
import App from '../renderer/App';

const electronHandler: ElectronHandler = {
  getWorkspace: () => Promise.resolve('Notes'),
  listFolders: () => Promise.resolve([]),
  listNotes: () => Promise.resolve([]),
  fetchNote: () => Promise.reject(Error('Not implemented')),

  createFolder: () => Promise.reject(Error('Not implemented')),
  createNote: () => Promise.reject(Error('Not implemented')),
  renameNote: () => Promise.reject(Error('Not implemented')),
  deleteNote: () => Promise.reject(Error('Not implemented')),
  renameFolder: () => Promise.reject(Error('Not implemented')),
  saveNote: () => Promise.reject(Error('Not implemented')),
  showFolderMenu: () => Promise.reject(Error('Not implemented')),
  showNoteMenu: () => Promise.reject(Error('Not implemented')),
  showDialog: () => Promise.reject(Error('Not implemented')),
  closeDialog: () => Promise.reject(Error('Not implemented')),

  onSwitchedWorkspace: () => () => {},
  onCreatedFolder: () => () => {},
  onRenamedFolder: () => () => {},
  onCreatedNote: () => () => {},
  onRenamedNote: () => () => {},
  onDeletedNote: () => () => {},
  onInitCreateNoteDialog: () => () => {},
  onInitRenameNoteDialog: () => () => {},
  onInitDeleteNoteDialog: () => () => {},
  onInitRenameFolderDialog: () => () => {},
  onMenuCommandNewNote: () => () => {},
  onMenuCommandRenameNote: () => () => {},
  onMenuCommandDeleteNote: () => () => {},
  onMenuCommandNewFolder: () => () => {},
  onMenuCommandRenameFolder: () => () => {},
  onError: () => () => {},

  ipcRenderer: {
    once() {},
  },
};

window.electron = electronHandler;

describe('App', () => {
  it('should render', () => {
    const app = render(<App />);
    expect(app).toBeTruthy();
    waitFor(() => expect(app.findByText('Folder')).toBeTruthy());
  });
});
