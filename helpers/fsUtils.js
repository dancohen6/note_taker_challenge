const fs = require('fs');
const util = require('util');

// PROMISE VERSION OF fs.readFile //
const readFromFile = util.promisify(fs.readFile);

// FUNCTION TO WRITE DATA TO A JSON FILE GIVEN A DESTINATION AND CONTENT //
const writeToFile = (destination, content) => {
  return fs.promises.writeFile(destination, JSON.stringify(content, null, 4))
    // LOG SUCCESS MESSAGE IF WRITE OPERATION IS SUCCESSFUL //
    .then(() => console.info(`\nData written to ${destination}`))
    // LOG ERROR MESSAGE IF WRITE OPERATION FAILS //
    .catch((err) => console.error(err));
};

// FUNCTION TO READ DATA FROM A FILE, APPEND CONTENT, AND WRITE BACK TO THE FILE //
const readAndAppend = (content, file) => {
  // READ DATA FROM SPECIFIED FILE AS UTF-8 ENCODED STRING //
  return fs.promises.readFile(file, 'utf8')
    .then((data) => {
      // PARSE DATA AS JSON STRING INTO JS OBJECT //
      const parsedData = JSON.parse(data);
      // APPEND CONTENT TO PARSED DATA //
      parsedData.push(content);
      // WRITE UPDATED DATA BACK TO FILE //
      return writeToFile(file, parsedData);
    })
    // LOG ERROR MESSAFE UF ERROR OCCURS DURING READ/WRITE //
    .catch((err) => console.error(err));
};

// EXPORT FUNCTIONS FOR ACCESS BY OTHER MODULES //
module.exports = { readFromFile, writeToFile, readAndAppend };