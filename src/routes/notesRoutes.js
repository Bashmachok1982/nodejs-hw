import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

// celebrate / joi / validator celebrate(function) + validator ID(noteID)
import { celebrate } from 'celebrate';
import {
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
  getAllNotesSchema,
} from '../validations/notesValidation.js';

const router = Router();

//! GET (all)
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

//! GET notes/:noteId
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

//! POST
router.post('/notes', celebrate(createNoteSchema), createNote);

//! DELETE
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

//! PATCH
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
