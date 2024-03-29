const path = require('path');
const rread = require('fs-readdir-recursive');

/**
 * Recursively retrieves all file paths for the given types.
 *
 * @param {string} baseDirname The base directory path to search in.
 * @param {string[]} extensions File extensions to search for.
 * @return {Promise<string[]>} An array of absolute file paths which point to
 * the queried files.
 */
const fetchRecursiveFilePaths = async (baseDirname, extensions = []) => {
  try {
    const filePaths = await (() => {
      return new Promise((resolve, reject) => {
        try {
          let readFiles = rread(baseDirname);

          readFiles = readFiles.map((file) => {
            return `${baseDirname}${path.sep}${file}`;
          });

          readFiles = readFiles.filter((file) => {
            return extensions.includes(path.extname(file));
          });

          return resolve(readFiles);
        } catch (exc) {
          return reject(exc);
        }
      });
    })();

    return filePaths;
  } catch (exc) {
    throw exc;
  }
};

module.exports = fetchRecursiveFilePaths;
