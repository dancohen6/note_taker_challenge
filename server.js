const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helpers/fsUtils');

// IMPORTING UUID FUNCTION TO GENERATE UNIQUE NOTE IDs //
const uuid = require('./helpers/uuid');
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DELETE ENDPOINT TO REMOVE A NOTE BY ID //
app.delete('/api/notes/:id', (req, res) => {
  const noteID = req.params.id;
  // READ DATA FROM JSON FILE //
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // MAKE NEW ARRAY OF ALL NOTES ASIDE FROM NOTE WITH ID PROVIDED IN URL //
      const result = json.filter((note) => note.id !== noteID);

      // SAVE UPDATED ARRAY TO JSON FILE //
      writeToFile('./db/db.json', result);

      // RESPOND TO DELETE REQUEST WITH CONFIRMATION //
      res.json(`Item ${noteID} has been deleted 🗑️`);
    });
});

// GET ENDPOINT TO SERVE HOMEPAGE //
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// GET ENDPOINT TO SERVE NOTES PAGE //
app.get('/notes', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'notes.html'));
});

// GET ENDPOINT TO RETRIEVE ALL NOTES //
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(400).json({ err });
    }
    // PARSE JSON AND SEND AS A RESPONSE //
    res.json(JSON.parse(data));
  });
});

// POST ENDPOINT TO ADD NEW NOTE //
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      // GENERATE UNIQUE ID //
      id: uuid(),
    };
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
      if (err) throw err;
      data = JSON.parse(data);
      data.push(newNote);

      // WRITE UPDATED DATA TO JSON FILE //
      fs.writeFile(`./db/db.json`, JSON.stringify(data, null, '\t'), (err) =>
        err
          ? console.error(err)
          : console.log(`${newNote.title} has been written to JSON file`)
      );

      // RESPOND TO POST REQUEST WITH NEW NOTE //
      res.json(newNote);
    });
  } else {
    // If title or text is missing, respond with an error message
    // RESPOND WITH ERROR IF TITLE/TEXT IS MISSING //
    res.status(400).json({ error: 'Title and text are required fields.' });
  }
});

// START SERVER AND LISTEN ON PORT //
app.listen(PORT, () => console.log('Listening on port %s', PORT));