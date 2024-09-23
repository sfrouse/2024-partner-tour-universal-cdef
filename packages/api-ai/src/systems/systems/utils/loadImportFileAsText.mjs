import fs from 'fs/promises'; // Use fs.promises for async functions
import path from 'path';
import { createRequire } from 'module';

export default async function loadImportFileAsText(packageName, filePath) {
  const fullFilePath = path.resolve(
    `${await getModuleDir(packageName)}/${filePath}`
  );
  try {
    const cssText = await fs.readFile(fullFilePath, 'utf-8'); // Read the file as text
    return cssText;
  } catch (error) {
    console.error('Error loading CSS file:', error);
  }
}

/**
 * Get's the file path to a module folder.
 * @param {string} moduleEntry 
 */
const getModuleDir = async (moduleEntry) => {
  const packageName = moduleEntry.includes('/') 
    ? moduleEntry.startsWith('@') 
      ? moduleEntry.split('/').slice(0, 2).join('/') 
      : moduleEntry.split('/')[0]
    : moduleEntry;

  const require = createRequire(import.meta.url);
  const lookupPaths = require.resolve.paths(moduleEntry).map((p) => path.join(p, packageName));

  // Check which path exists
  for (const p of lookupPaths) {
    try {
      await fs.access(p); // Check if the path exists
      return p; // Return the path if it exists
    } catch (err) {
      // Path doesn't exist, continue to next
    }
  }

  throw new Error(`Module path for ${moduleEntry} not found`);
};