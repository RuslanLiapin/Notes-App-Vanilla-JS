'use strict';

const { notesArr } = require('./noteArr');
const { renderNotes,
  updateSummary } = require('./render');
const { addNote,
  toggleArchive,
  deleteNote,
  handleEditButtonClick,
  handleSaveButtonClick,
  handleCancelButtonClick } = require('./notes');

document.getElementById('addNoteBtn').addEventListener('click', addNote);

document.getElementById('app').addEventListener('click', (event) => {
  const targetClassList = event.target.classList;
  const row = event.target.closest('tr');
  const noteId = parseInt(event.target.dataset.id);
  const note = notesArr.find(n => n.id === noteId);

  if (targetClassList.contains('archiveBtn')) {
    toggleArchive(noteId);
  }

  if (targetClassList.contains('deleteBtn')) {
    deleteNote(noteId);
  }

  if (targetClassList.contains('editBtn')) {
    handleEditButtonClick(row, note);
  }

  if (targetClassList.contains('saveBtn')) {
    handleSaveButtonClick(row, note);
  }

  if (targetClassList.contains('cancelBtn')) {
    handleCancelButtonClick(row, note);
  }
});

renderNotes();
updateSummary();
