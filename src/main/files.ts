import log from 'electron-log';
import fs from 'fs';
import path from 'path';
import applicationState from './state';

function isDirectory(p: string): boolean {
  return fs.lstatSync(p).isDirectory();
}

function isFile(p: string): boolean {
  return fs.lstatSync(p).isFile();
}

function isHidden(p: string): boolean {
  return path.basename(p).startsWith('.');
}

function isMarkdown(p: string): boolean {
  return isFile(p) && path.extname(p).toLowerCase() === '.md';
}

async function listFiles(dir: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    // return the full path to each file
    fs.readdir(dir, (err, files) => (err ? reject(err) : resolve(files.map((name) => path.join(dir, name)))));
  });
}

async function readFile(file: string, encoding: BufferEncoding): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(file, (err, buffer) => (err ? reject(err) : resolve(buffer.toString(encoding))));
  });
}

async function writeFile(file: string, content: string, encoding: BufferEncoding): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(file, Buffer.from(content, encoding), (err) => (err ? reject(err) : resolve()));
  });
}

async function createFile(file: string, content = ''): Promise<void> {
  if (fs.existsSync(file)) {
    throw new Error(`File '${file}' already exists`);
  }
  return writeFile(file, content, 'utf-8');
}

async function moveFile(from: string, to: string): Promise<void> {
  if (fs.existsSync(to)) {
    throw new Error(`File '${to}' already exists`);
  }
  const parent = path.dirname(to);
  if (!fs.existsSync(parent) || !isDirectory(parent)) {
    throw new Error(`Directory '${parent}' does not exist or is not a directory`);
  }
  return new Promise<void>((resolve, reject) => {
    fs.rename(from, to, (err) => (err ? reject(err) : resolve()));
  });
}

async function createDirectory(folder: string): Promise<void> {
  if (fs.existsSync(folder)) {
    throw new Error(`Folder '${folder}' already exists`);
  }
  return fs.mkdirSync(folder);
}

/**
 * Lists the top-level folders.
 * @returns list of folder names.
 */
export async function listFolders(): Promise<string[]> {
  const files = await listFiles(applicationState.workspace);
  return files.filter((file) => isDirectory(file) && !isHidden(file)).map((file) => path.basename(file));
}

/**
 * Lists the notes in the given folder.
 * @param folder name of the folder.
 * @returns list of note names.
 */
export async function listNotes(folder: string): Promise<string[]> {
  const files = await listFiles(path.join(applicationState.workspace, folder));
  return files.filter((file) => isMarkdown(file) && !isHidden(file)).map((file) => path.basename(file, '.md'));
}

/**
 * Fetches the contents of the given note.
 * @param folder name of the folder containing the note.
 * @param file name of the note.
 * @returns contents of the note.
 */
export async function fetchNote(folder: string, file: string): Promise<string> {
  return readFile(path.join(applicationState.workspace, folder, `${file}.md`), 'utf-8');
}

/**
 * Saves the given note.
 * @param folder name of the folder containing the note.
 * @param file name of the note.
 * @param content contents of the note.
 */
export async function saveNote(folder: string, file: string, content: string): Promise<void> {
  log.debug(`Saving <${folder}/${file}>`);
  return writeFile(path.join(applicationState.workspace, folder, `${file}.md`), content, 'utf-8');
}

/**
 * Creates a new note.
 * @param folder name of an existing folder to contain the note.
 * @param file name of the new note.
 * @throws if a note with the given name already exists in the same folder
 */
export async function createNote(folder: string, file: string): Promise<void> {
  log.debug(`Attempting to create <${folder}/${file}>`);
  return createFile(path.join(applicationState.workspace, folder, `${file}.md`), `# ${file}\n\n`);
}

/**
 * Renames a note.
 * @param folder name of the folder containing the note.
 * @param file current name of the note.
 * @param newFile new name of the note.
 */
export async function renameNote(folder: string, file: string, newFile: string): Promise<void> {
  log.debug(`Attempting to rename <${folder}/${file}> to <${newFile}>`);
  const parentDirectory = path.join(applicationState.workspace, folder);
  return moveFile(path.join(parentDirectory, `${file}.md`), path.join(parentDirectory, `${newFile}.md`));
}

/**
 * Creates a new folder.
 * @param folder name of the new folder.
 * @throws if a folder with the given name already exists in the workspace
 */
export async function createFolder(folder: string): Promise<void> {
  log.debug(`Attempting to create <${folder}>`);
  return createDirectory(path.join(applicationState.workspace, folder));
}
