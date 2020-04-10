const path = require("path");
const express = require("express");
const fs = require("fs")
let notesDB = require("./db/db.json")

const dbFile = path.join(__dirname, "db/db.json")

let lastId = notesDB.length;

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
// This middleware is responsible for constructing the
// body property on the response object passed to our route handlers.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    express.static(path.join(__dirname, "public"))
);

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))

})

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "/public/index.html"))
// })

app.get("/api/notes", (req, res) => {
    res.json(getNotes());
})

app.post('/api/notes', (req, res) => {
    const noteInput = req.body;
    lastId += 1;

    noteInput.id = lastId;

    console.log(noteInput);

    notesDB.push(noteInput);

    res.json(noteInput);

    fs.writeFile(dbFile, JSON.stringify(notesDB), function(err, result) {
        if (err) {
            console.log('error', err);
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {

    notesDB = notesDB.filter(note => note.id !== parseInt(req.params.id))

    res.json(notesDB)
})

function getNotes() {
    console.log(notesDB)
    return notesDB
};


// Starts the server to begin listening
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});