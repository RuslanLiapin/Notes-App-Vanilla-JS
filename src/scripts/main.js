'use strict';

function renderNoteRow(note) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${note.createdAt.toLocaleString()}</td>
    <td>${note.content}</td>
    <td>${note.category}</td>
    <td>${note.datesMentioned.join(', ')}</td>
    <td>
      <button data-id="${note.id}" class="button is-info editBtn">Edit</button>
      <button data-id="${note.id}" class="button ${
  note.archived ? 'is-success' : 'is-warning'
} archiveBtn">${note.archived ? 'Unarchive' : 'Archive'}</button>
      <button
        data-id="${note.id}"
        class="button is-danger deleteBtn"
      >
        Delete
      </button>
    </td>
  `;

  return row;
}

const notesArr = [
  {
    id: 1,
    createdAt: new Date('2023-07-01 10:00'),
    content: 'Buy groceries for dinner.',
    category: 'Task',
    datesMentioned: ['2023-07-02', '2023-07-03'],
    archived: false,
  },
];

function renderNotes() {
  const notesTableBody = document.getElementById('notesBody');

  notesTableBody.innerHTML = '';

  for (const note of notesArr.filter(n => !n.archived)) {
    const row = renderNoteRow(note);

    notesTableBody.appendChild(row);
  }
}

function addNote() {
  const noteContent = document.getElementById('noteContent').value.trim();
  const noteCategory = document.getElementById('noteCategory').value;

  const datesMentioned = noteContent.match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || [];
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
}

document.getElementById('addNoteBtn').addEventListener('click', addNote);

renderNotes();
