// IMPORT REQUIRED MODULES //
const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./Test/fsUtils');
const notes = require('./db/db.json');
const uuid = require('./Test/uuid');

// CREATE EXPRESS APP / MIDDLEWARE CONFIG //
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DELETE REQUESTS //
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const noteID = req.params.id;
    const data = await readFromFile('./db/db.json');
    const json = JSON.parse(data);
    const result = json.filter((note) => note.id !== noteID);
    await writeToFile('./db/db.json', result);
    res.json(`Item ${noteID} has been deleted 🗑️`);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ROUTES //

// GET REQUESTS //
// HOMEPAGE //
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});
// NOTES PAGE //
app.get('/notes', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/notes.html'));
});
// RETRIEVING NOTES //
app.get('/api/notes', async (req, res) => {
  try {
    const data = await readFromFile('./db/db.json');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST REQUESTS //
app.post('/api/notes', async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text are required fields' });
    }

    // NEW NOTES //
    const newNote = {
      title,
      text,
    // CALL UUID //
      id: uuid(), 
    };

    const data = await readFromFile('db/db.json');
    const notesArray = JSON.parse(data);
    notesArray.push(newNote);

    await writeToFile(`./db/db.json`, JSON.stringify(notesArray, null, '\t'));
    res.json(notesArray);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// START SERVER //
app.listen(PORT, () => console.log('Listening on port %s', PORT));