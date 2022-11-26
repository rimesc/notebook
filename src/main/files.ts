import fs from 'fs';
import path from 'path';

const root = path.join(process.env.HOME!, 'Notes');

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
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        // return the full path to the file
        resolve(files.map((name) => path.join(dir, name)));
      }
    });
  });
}

async function readFile(file: string, encoding: BufferEncoding): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(file, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString(encoding));
      }
    });
  });
}

/**
 * Lists the top-level folders.
 * @returns list of folder names.
 */
export async function listFolders(): Promise<string[]> {
  const files = await listFiles(root);
  return files.filter((file) => isDirectory(file) && !isHidden(file)).map((file) => path.basename(file));
}

/**
 * Lists the notes in the given folder.
 * @param folder name of the folder.
 * @returns list of note names.
 */
export async function listNotes(folder: string): Promise<string[]> {
  const files = await listFiles(path.join(root, folder));
  return files.filter((file) => isMarkdown(file) && !isHidden(file)).map((file) => path.basename(file, '.md'));
}

/**
 * Fetches the contents of the given note.
 * @param folder name of the folder containing the note.
 * @param file name of the note.
 * @returns contents of the note.
 */
export async function fetchNote(folder: string, file: string): Promise<string> {
  return readFile(path.join(root, folder, `${file}.md`), 'utf-8');
}
