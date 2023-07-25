// IMPORT REQUIRED MODULES //
const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);

// WRITE CONTENT TO DESTINATION //
async function writeToFile(destination, content) {
  try {
    await fs.promises.writeFile(destination, JSON.stringify(content, null, 4));
    console.info(`\nData written to ${destination}`);
  } catch (err) {
    console.error(err);
  }
}

// READ DATA FROM FILE / APPEND CONTENT TO EXISTING DATA //
async function readAndAppend(content, file) {
  try {
    const data = await fs.promises.readFile(file, 'utf8');
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    await writeToFile(file, parsedData);
  } catch (err) {
    console.error(err);
  }
}

// EXPORT FUNCTIONS SO OTHER MODULES CAN USE THEM //
module.exports = { readFromFile, writeToFile, readAndAppend };