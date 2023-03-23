import log from 'electron-log';
import fs from 'fs/promises';
import filterAsync from 'node-filter-async';
import path from 'path';
import applicationState from './state';

const errorCode = (error: any) => error.code as string | undefined;
const folderPath = (folder: string) => path.join(applicationState.workspace, folder);
const filePath = (folder: string, file: string) => path.join(folderPath(folder), `${file}.md`);
const isHidden = (file: string) => path.basename(file).startsWith('.');

async function exists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch (error) {
    if (errorCode(error) === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function isDirectory(p: string): Promise<boolean> {
  try {
    const lstat = await fs.stat(p);
    return lstat.isDirectory();
  } catch (error) {
    if (errorCode(error) === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function isFile(p: string): Promise<boolean> {
  try {
    const lstat = await fs.stat(p);
    return lstat.isFile();
  } catch (error) {
    if (errorCode(error) === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function isMarkdown(p: string): Promise<boolean> {
  return (await isFile(p)) && path.extname(p).toLowerCase() === '.md';
}

/**
 * Lists the top-level folders.
 * @returns list of folder names.
 */
export async function listFolders(): Promise<string[]> {
  async function list() {
    try {
      const entries = await fs.readdir(applicationState.workspace);
      return entries.map((entry) => folderPath(entry));
    } catch (error) {
      switch (errorCode(error)) {
        case 'ENOENT':
        case 'ENOTDIR':
          throw new Error('Workspace not found');
        default:
          throw error;
      }
    }
  }
  const entries = await list();
  return (await filterAsync(entries, async (entry) => (await isDirectory(entry)) && !isHidden(entry))).map((file) =>
    path.basename(file)
  );
}

/**
 * Lists the notes in the given folder.
 * @param folder name of the folder.
 * @returns list of note names.
 */
export async function listNotes(folder: string): Promise<string[]> {
  const pathToFolder = folderPath(folder);
  async function list() {
    try {
      const entries = await fs.readdir(pathToFolder);
      return entries.map((entry) => path.join(pathToFolder, entry));
    } catch (error) {
      switch (errorCode(error)) {
        case 'ENOENT':
        case 'ENOTDIR':
          throw new Error(`Folder '${folder}' not found`);
        default:
          throw error;
      }
    }
  }
  const entries = await list();
  return (await filterAsync(entries, async (entry) => (await isMarkdown(entry)) && !isHidden(entry))).map((file) =>
    path.basename(file, '.md')
  );
}

/**
 * Fetches the contents of the given note.
 * @param folder name of the folder containing the note.
 * @param file name of the note.
 * @returns contents of the note.
 */
export async function fetchNote(folder: string, file: string): Promise<string> {
  const pathToFile = filePath(folder, file);
  try {
    return await fs.readFile(pathToFile, 'utf-8');
  } catch (error) {
    switch (errorCode(error)) {
      case 'ENOENT':
        throw new Error(`Note '${file}' not found in folder '${folder}'`);
      default:
        throw error;
    }
  }
}

/**
 * Saves the given note.
 * @param folder name of the folder containing the note.
 * @param file name of the note.
 * @param content contents of the note.
 */
export async function saveNote(folder: string, file: string, content: string): Promise<void> {
  log.debug(`Saving <${folder}/${file}>`);
  const pathToFile = filePath(folder, file);
  try {
    return await fs.writeFile(pathToFile, content, 'utf-8');
  } catch (error) {
    switch (errorCode(error)) {
      case 'ENOENT':
        throw new Error(`Folder '${folder}' not found`);
      default:
        throw error;
    }
  }
}

/**
 * Creates a new note.
 * @param folder name of an existing folder to contain the note.
 * @param file name of the new note.
 * @throws if a note with the given name already exists in the same folder
 */
export async function createNote(folder: string, file: string): Promise<void> {
  log.debug(`Attempting to create <${folder}/${file}>`);
  const pathToFile = filePath(folder, file);
  if (await exists(pathToFile)) {
    throw new Error(`Note '${file}' already exists`);
  }
  try {
    return fs.writeFile(pathToFile, `# ${file}\n\n`, 'utf-8');
  } catch (error) {
    switch (errorCode(error)) {
      case 'ENOENT':
        throw new Error(`Folder '${folder}' not found`);
      default:
        throw error;
    }
  }
}

/**
 * Renames a note.
 * @param folder name of the folder containing the note.
 * @param file current name of the note.
 * @param newFile new name of the note.
 */
export async function renameNote(folder: string, file: string, newFile: string): Promise<void> {
  log.debug(`Attempting to rename <${folder}/${file}> to <${newFile}>`);
  const fromPath = filePath(folder, file);
  const toPath = filePath(folder, newFile);
  if (await exists(toPath)) {
    throw new Error(`Note '${newFile}' already exists in folder '${folder}'`);
  }
  try {
    await fs.rename(fromPath, toPath);
  } catch (error) {
    switch (errorCode(error)) {
      case 'ENOENT':
        throw new Error(`Note '${file}' not found in folder '${folder}'`);
      default:
        throw error;
    }
  }
}

/**
 * Deletes a note.
 * @param folder name of the folder containing the note.
 * @param file name of the note.
 */
export async function deleteNote(folder: string, file: string): Promise<void> {
  log.debug(`Attempting to delete <${folder}/${file}>`);
  const pathToNote = filePath(folder, file);
  try {
    await fs.rm(pathToNote);
  } catch (error) {
    switch (errorCode(error)) {
      case 'ENOENT':
        throw new Error(`Note '${file}' not found in folder '${folder}'`);
      default:
        throw error;
    }
  }
}

/**
 * Creates a new folder.
 * @param folder name of the new folder.
 * @throws if a folder with the given name already exists in the workspace
 */
export async function createFolder(folder: string): Promise<void> {
  log.debug(`Attempting to create <${folder}>`);
  try {
    await fs.mkdir(folderPath(folder));
  } catch (error) {
    switch (errorCode(error)) {
      case 'EEXIST':
        throw new Error(`Folder '${folder}' already exists`);
      case 'ENOENT':
        throw new Error(`Workspace not found`);
      default:
        throw error;
    }
  }
}

/**
 * Renames a folder.
 * @param folder current name of the folder.
 * @param newFile new name of the folder.
 */
export async function renameFolder(folder: string, newFolder: string): Promise<void> {
  log.debug(`Attempting to rename <${folder}> to <${newFolder}>`);
  const fromPath = folderPath(folder);
  const toPath = folderPath(newFolder);
  if (await exists(toPath)) {
    throw new Error(`Folder '${newFolder}' already exists`);
  }
  try {
    await fs.rename(fromPath, toPath);
  } catch (error) {
    switch (errorCode(error)) {
      case 'ENOENT':
        throw new Error(`Folder '${folder}' not found`);
      default:
        throw error;
    }
  }
}
