import { readFile } from 'fs/promises';

export default async function loadFileAsText(filePath) {
    try {
      const content = await readFile(filePath, 'utf8');
      return content;
    } catch (err) {
      console.error('Error reading file', err);
      throw err;
    }
}