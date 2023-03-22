import fs from 'fs';
import path from 'path';
import temp from 'tempy';
import {
  createFolder,
  createNote,
  fetchNote,
  listFolders,
  listNotes,
  renameFolder,
  renameNote,
  saveNote,
} from '../main/files';
import state from '../main/state';

let workspace: string;

beforeEach(() => {
  workspace = temp.directory();
  state.workspace = workspace;
});

afterEach(() => {
  fs.rmSync(workspace, { recursive: true, force: true });
});

describe('listFolders', () => {
  it('lists the folders in the workspace', async () => {
    await createFolder('First folder');
    await createFolder('Second folder');
    await createFolder('Third folder');
    await expect(listFolders()).resolves.toEqual(['First folder', 'Second folder', 'Third folder']);
  });
  it('ignores hidden folders in the workspace', async () => {
    await createFolder('First folder');
    await createFolder('Second folder');
    await createFolder('.Third folder');
    await expect(listFolders()).resolves.toEqual(['First folder', 'Second folder']);
  });
  it('ignores non-folders in the workspace', async () => {
    await createFolder('First folder');
    await createFolder('Second folder');
    fs.writeFileSync(path.join(workspace, 'A file'), '');
    await expect(listFolders()).resolves.toEqual(['First folder', 'Second folder']);
  });
  it('returns empty array if there are no folders in the workspace', async () => {
    await expect(listFolders()).resolves.toEqual([]);
  });
});

describe('listNotes', () => {
  it('lists the markdown files in the folder', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'First note');
    await createNote('Folder', 'Second note');
    await createNote('Folder', 'Third note');
    await expect(listNotes('Folder')).resolves.toEqual(['First note', 'Second note', 'Third note']);
  });
  it('ignores hidden markdown files in the folder', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'First note');
    await createNote('Folder', 'Second note');
    await createNote('Folder', '.Third note');
    await expect(listNotes('Folder')).resolves.toEqual(['First note', 'Second note']);
  });
  it('ignores non-markdown files in the workspace', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'First note');
    await createNote('Folder', 'Second note');
    fs.writeFileSync(path.join(workspace, 'Folder', 'A file'), '');
    await expect(listNotes('Folder')).resolves.toEqual(['First note', 'Second note']);
  });
  it('returns empty array if there are no files in the folder', async () => {
    await createFolder('Folder');
    await expect(listNotes('Folder')).resolves.toEqual([]);
  });
  it('throws if the folder does not exist', async () => {
    await expect(listNotes('Folder')).rejects.toThrow(
      `Directory '${path.join(workspace, 'Folder')}' does not exist or is not a directory`
    );
  });
  it('throws if the folder is not a folder', async () => {
    fs.writeFileSync(path.join(workspace, 'Folder'), '');
    await expect(listNotes('Folder')).rejects.toThrow(
      `Directory '${path.join(workspace, 'Folder')}' does not exist or is not a directory`
    );
  });
});

describe('fetchNote', () => {
  it('fetches the content of the note', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Note');
    await expect(fetchNote('Folder', 'Note')).resolves.toEqual('# Note\n\n');
  });
  it('throws if the note does not exist', async () => {
    await expect(fetchNote('Folder', 'Note')).rejects.toThrow(
      `File '${path.join(workspace, 'Folder', 'Note.md')}' does not exist`
    );
  });
});

describe('saveNote', () => {
  it('overwrites the content of the note', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Note');
    await saveNote('Folder', 'Note', '# New content');
    await expect(fetchNote('Folder', 'Note')).resolves.toEqual('# New content');
  });
  it('creates the note if it does not exist', async () => {
    await createFolder('Folder');
    await saveNote('Folder', 'Note', '# New content');
    await expect(fetchNote('Folder', 'Note')).resolves.toEqual('# New content');
  });
});

describe('createNote', () => {
  it('creates a markdown file', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'New note');
    const expectedPath = path.join(workspace, 'Folder', 'New note.md');
    expect(fs.existsSync(expectedPath)).toBeTruthy();
    expect(fs.readFileSync(expectedPath).toString('utf-8')).toBe('# New note\n\n');
  });
  it('throws if a note already exists with the same name in the same folder', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Note');
    await expect(createNote('Folder', 'Note')).rejects.toThrow(
      `File '${path.join(workspace, 'Folder', 'Note.md')}' already exists`
    );
  });
  it('throws if a note already exists in the same folder with name differing only by case', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Note');
    await expect(createNote('Folder', 'note')).rejects.toThrow(
      `File '${path.join(workspace, 'Folder', 'note.md')}' already exists`
    );
  });
});

describe('renameNote', () => {
  it('renames the markdown file, preserving the original content', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Original note');
    await renameNote('Folder', 'Original note', 'Renamed note');
    const originalPath = path.join(workspace, 'Folder', 'Original note.md');
    const expectedPath = path.join(workspace, 'Folder', 'Renamed note.md');
    expect(fs.existsSync(originalPath)).toBeFalsy();
    expect(fs.existsSync(expectedPath)).toBeTruthy();
    expect(fs.readFileSync(expectedPath).toString('utf-8')).toBe('# Original note\n\n');
  });
  it('throws if a note already exists with the same name in the same folder', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Original note');
    await createNote('Folder', 'Other note');
    await expect(renameNote('Folder', 'Original note', 'Other note')).rejects.toThrow(
      `File '${path.join(workspace, 'Folder', 'Other note.md')}' already exists`
    );
    const originalPath = path.join(workspace, 'Folder', 'Original note.md');
    expect(fs.existsSync(originalPath)).toBeTruthy();
  });
  it('throws if a note already exists in the same folder with name differing only by case', async () => {
    await createFolder('Folder');
    await createNote('Folder', 'Original note');
    await createNote('Folder', 'Other note');
    await expect(renameNote('Folder', 'Original note', 'other note')).rejects.toThrow(
      `File '${path.join(workspace, 'Folder', 'other note.md')}' already exists`
    );
    const originalPath = path.join(workspace, 'Folder', 'Original note.md');
    expect(fs.existsSync(originalPath)).toBeTruthy();
  });
});

describe('createFolder', () => {
  it('creates a folder', async () => {
    await createFolder('Folder');
    const expectedPath = path.join(workspace, 'Folder');
    expect(fs.lstatSync(expectedPath).isDirectory()).toBeTruthy();
  });
  it('throws if a folder already exists with the same name in the workspace', async () => {
    await createFolder('Folder');
    await expect(createFolder('Folder')).rejects.toThrow(`Folder '${path.join(workspace, 'Folder')}' already exists`);
  });
  it('throws if a folder already exists in the workspace with name differing only by case', async () => {
    await createFolder('Folder');
    await expect(createFolder('folder')).rejects.toThrow(`Folder '${path.join(workspace, 'folder')}' already exists`);
  });
  it('throws if a file already exists with the same name in the workspace', async () => {
    fs.writeFileSync(path.join(workspace, 'Folder'), '');
    await expect(createFolder('Folder')).rejects.toThrow(`Folder '${path.join(workspace, 'Folder')}' already exists`);
  });
  it('throws if a file already exists in the workspace with name differing only by case', async () => {
    fs.writeFileSync(path.join(workspace, 'Folder'), '');
    await expect(createFolder('folder')).rejects.toThrow(`Folder '${path.join(workspace, 'folder')}' already exists`);
  });
});

describe('renameFolder', () => {
  it('renames the folder', async () => {
    await createFolder('Original folder');
    await createNote('Original folder', 'Note');
    await renameFolder('Original folder', 'Renamed folder');
    const originalPath = path.join(workspace, 'Original folder');
    const expectedPath = path.join(workspace, 'Renamed folder');
    expect(fs.existsSync(originalPath)).toBeFalsy();
    expect(fs.lstatSync(expectedPath).isDirectory).toBeTruthy();
    expect(fs.readdirSync(expectedPath)).toContain('Note.md');
  });
  it('throws if a folder already exists with the same name in the workspace', async () => {
    await createFolder('Original folder');
    await createNote('Original folder', 'Note');
    await createFolder('Other folder');
    await expect(renameFolder('Original folder', 'Other folder')).rejects.toThrow(
      `Folder '${path.join(workspace, 'Other folder')}' already exists`
    );
    const originalPath = path.join(workspace, 'Original folder');
    expect(fs.lstatSync(originalPath).isDirectory).toBeTruthy();
    expect(fs.readdirSync(originalPath)).toContain('Note.md');
  });
  it('throws if a folder already exists in the workspace with name differing only by case', async () => {
    await createFolder('Original folder');
    await createNote('Original folder', 'Note');
    await createFolder('Other folder');
    await expect(renameFolder('Original folder', 'other folder')).rejects.toThrow(
      `Folder '${path.join(workspace, 'other folder')}' already exists`
    );
    const originalPath = path.join(workspace, 'Original folder');
    expect(fs.lstatSync(originalPath).isDirectory).toBeTruthy();
    expect(fs.readdirSync(originalPath)).toContain('Note.md');
  });
  it('throws if a file already exists with the same name in the workspace', async () => {
    await createFolder('Original folder');
    await createNote('Original folder', 'Note');
    fs.writeFileSync(path.join(workspace, 'Other folder'), '');
    await expect(renameFolder('Original folder', 'Other folder')).rejects.toThrow(
      `Folder '${path.join(workspace, 'Other folder')}' already exists`
    );
    const originalPath = path.join(workspace, 'Original folder');
    expect(fs.lstatSync(originalPath).isDirectory).toBeTruthy();
    expect(fs.readdirSync(originalPath)).toContain('Note.md');
  });
  it('throws if a file already exists in the workspace with name differing only by case', async () => {
    await createFolder('Original folder');
    await createNote('Original folder', 'Note');
    fs.writeFileSync(path.join(workspace, 'Other folder'), '');
    await expect(renameFolder('Original folder', 'other folder')).rejects.toThrow(
      `Folder '${path.join(workspace, 'other folder')}' already exists`
    );
    const originalPath = path.join(workspace, 'Original folder');
    expect(fs.lstatSync(originalPath).isDirectory).toBeTruthy();
    expect(fs.readdirSync(originalPath)).toContain('Note.md');
  });
});
