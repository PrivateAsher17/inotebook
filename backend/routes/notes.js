const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
var Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: fetch all notes using GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Add a new note using POST "/api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({min: 5}),
    body("description", "description be minimum of five characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      // const notes = await Notes.find({user: req.user.id})
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route : Update a note using PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id",fetchuser, async (req, res) => {
  const {title, description, tag} = req.body
  // Create a newNote object
  var newNote = {}
  if(title){newNote.title = title}
  if(description){newNote.description = description}
  if(tag){newNote.tag = tag}

  //Find the note to be updated and update it
  let note = await Note.findById(req.params.id)
  if (!note){
    return res.status(404).send("Not Found")}

  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json(note)


})

module.exports = router;
