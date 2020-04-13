const path = require("path");
const express = require("express");
const fs = require("fs")
let notesDB = require("./db/db.json")

const dbFile = path.join(__dirname, "db/db.json")

let lastId = notesDB.length;

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
// This middleware is responsible for constructing the
// body property on the response object passed to our route handlers.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//makes public root directory for static assets
app.use(
    express.static(path.join(__dirname, "public"))
);


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))

})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

//displays db.json content
app.get("/api/notes", (req, res) => {
    res.json(getNotes());
})

//adds new notes to db.json
app.post('/api/notes', (req, res) => {

    postNotes(req, res);

    writeNotes();
})

//removes notes based on id
app.delete('/api/notes/:id', (req, res) => {

    deleteNotes(req, res);

    writeNotes();

})

function getNotes() {
    return notesDB
};

function postNotes(req, res) {
    const noteInput = req.body;
    lastId += 1;
    checkIDs();

    noteInput.id = lastId;

    notesDB.push(noteInput);

    res.json(noteInput);
};

//checks if an id has already appeared before assigning it
function checkIDs() {
    notesDB.forEach(element => {
        if (element.id == lastId) {
            lastId = element.id++
        }
    });
};

//function for call write file multiple times
function writeNotes() {
    fs.writeFile(dbFile, JSON.stringify(notesDB), function(err, result) {
        if (err) {
            console.log('error', err);
        }
    });
};

function deleteNotes(req, res) {
    notesDB = notesDB.filter(note => note.id !== parseInt(req.params.id))

    res.json(notesDB)
};

// Starts the server to begin listening
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});