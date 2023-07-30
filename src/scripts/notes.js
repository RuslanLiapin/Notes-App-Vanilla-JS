'use strict';

const { getNotesArr, setNotesArr } = require('./notesState');
const { categories } = require('./categories');
const { renderNotes,
  updateSummary,
  renderEditableInput,
  renderEditableSelect } = require('./render');

const notesArr = getNotesArr();

function hideErrorMessage() {
  const errorMessage = document.getElementById('noteError');

  errorMessage.style.display = 'none';
}

function showErrorMessage(message, duration) {
  const errorMessage = document.getElementById('noteError');

  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(() => {
    hideErrorMessage();
  }, duration);
}

function extractDatesFromContent(content) {
  // eslint-disable-next-line max-len
  const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\.\d{2}\.\d{4}\b/g;

  return content.match(dateRegex) || [];
}

function addNote() {
  const noteContentInput = document.getElementById('noteContent');
  const noteContent = document.getElementById('noteContent').value.trim();
  const noteCategory = document.getElementById('noteCategory').value;

  if (noteContent === '') {
    showErrorMessage("Note can't be empty.", 3000);

    return;
  }

  const datesMentioned = extractDatesFromContent(noteContent);
  const newNote = {
    id: notesArr.length + 1,
    createdAt: new Date(),
    content: noteContent,
    category: noteCategory,
    datesMentioned,
    archived: false,
  };

  notesArr.push(newNote);

  renderNotes();
  updateSummary();
  noteContentInput.value = '';
}

function toggleArchive(noteId) {
  const note = notesArr.find(n => n.id === noteId);

  if (note) {
    note.archived = !note.archived;
    renderNotes();
    updateSummary();
  }
}

function deleteNote(noteId) {
  const filteredNotes = notesArr.filter((note) => {
    return note.id !== noteId;
  });

  setNotesArr(filteredNotes);
  renderNotes();
  updateSummary();
}

function handleEditButtonClick(row, note) {
  const noteContentCell = row.querySelector('.noteContent');
  const noteCategoryCell = row.querySelector('.noteCategory');
  const noteContent = noteContentCell.textContent;
  const noteCategory = noteCategoryCell.textContent;

  noteContentCell.innerHTML = renderEditableInput(noteContent);
  noteCategoryCell.innerHTML = renderEditableSelect(categories, noteCategory);

  row.querySelector('.editBtn').classList.add('is-hidden');
  row.querySelector('.archiveBtn').classList.add('is-hidden');
  row.querySelector('.deleteBtn').classList.add('is-hidden');
  row.querySelector('.saveBtn').classList.remove('is-hidden');
  row.querySelector('.cancelBtn').classList.remove('is-hidden');
}

function handleSaveButtonClick(row, note) {
  const noteContent = row.querySelector('input').value.trim();
  const noteCategory = row.querySelector('select').value;

  if (noteContent === '') {
    // eslint-disable-next-line no-undef
    alert("Note can't be empty.");

    return;
  }

  note.content = noteContent;
  note.category = noteCategory;
  renderNotes();
}

function handleCancelButtonClick(row, note) {
  const noteContentCell = row.querySelector('.noteContent');
  const noteCategoryCell = row.querySelector('.noteCategory');

  noteContentCell.innerHTML = note.content;
  noteCategoryCell.innerHTML = note.category;

  row.querySelector('.saveBtn').classList.add('is-hidden');
  row.querySelector('.cancelBtn').classList.add('is-hidden');
  row.querySelector('.editBtn').classList.remove('is-hidden');
  row.querySelector('.archiveBtn').classList.remove('is-hidden');
  row.querySelector('.deleteBtn').classList.remove('is-hidden');
}

module.exports = {
  addNote,
  toggleArchive,
  deleteNote,
  handleEditButtonClick,
  handleSaveButtonClick,
  handleCancelButtonClick,
};
