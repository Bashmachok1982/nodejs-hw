import { Router } from 'express';
import { getAllNotes } from '../controllers/notesController.js';
import { getNoteById } from '../controllers/notesController.js';
import { createNote } from '../controllers/notesController.js';
import { deleteNote } from '../controllers/notesController.js';
import { updateNote } from '../controllers/notesController.js';

const router = Router();

// all
router.get('/notes', getAllNotes);

// notes/:noteId
router.get('/notes/:noteId', getNoteById);

// post
router.post('/notes', createNote);

// delete
router.delete('/notes/:noteId', deleteNote);

// patch
router.patch('/notes/:noteId', updateNote);

export default router;
