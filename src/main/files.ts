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

export function listFolders(): string[] {
  return fs
    .readdirSync(root)
    .map((f) => path.join(root, f))
    .filter((d) => isDirectory(d) && !isHidden(d))
    .map((f) => path.basename(f));
}

export function listFiles(folder: string): string[] {
  const p = path.join(root, folder);
  return fs
    .readdirSync(p)
    .map((f) => path.join(p, f))
    .filter((n) => isMarkdown(n) && !isHidden(n))
    .map((n) => path.basename(n))
    .map((n) => n.substring(0, n.lastIndexOf('.')));
}
