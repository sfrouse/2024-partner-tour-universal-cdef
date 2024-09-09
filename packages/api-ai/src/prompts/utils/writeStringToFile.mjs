import { writeFile } from 'fs/promises';

export default async function writeStringToFile(
    filePath, content
) {
    try {
      await writeFile(filePath, content);
      console.log('File written successfully', filePath.split('/').pop());
    } catch (err) {
      console.error('Error writing to file', err);
    }
}