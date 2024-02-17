import fs, { type FileHandle } from 'node:fs/promises';

export class BaseFileManager {
  getAvailableFolders(path = '') {
    return fs.readdir(path);
  }

  async writeToFile(filePath: string, content: string) {
    let a: FileHandle;

    try {
      a = await fs.open(filePath, 'w+');
      await a.write(content);
    } finally {
      await a!.close();
    }
  }

  async readFile(filePath: string) {
    return JSON.parse(await fs.readFile(filePath, { encoding: 'utf8' }));
  }

  createFolder(startPath: string, folderPath: string) {
    return folderPath.split('/').reduce(async (r, path) => {
      const startPath = await r;
      const foldersPath = `${startPath}/${path}/`;

      try {
        await fs.access(foldersPath);
      } catch (e) {
        await fs.mkdir(foldersPath);
      }

      return Promise.resolve(foldersPath);
    }, Promise.resolve(startPath));
  }
}
