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
      <button
        data-id="${note.id}"
        class="button ${note.archived
    ? 'is-success' : 'is-warning'
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

function updateSummaryTable() {
  const categories = ['Task', 'Random Thought', 'Idea'];
  const activeSummary = [];
  const archivedSummary = [];

  for (const category of categories) {
    const countActive = notesArr
      .filter(n => n.category === category && !n.archived).length;
    const countArchived = notesArr
      .filter(n => n.category === category && !n.archived).length;

    activeSummary.push({
      category, countActive,
    });

    archivedSummary.push({
      category, countArchived,
    });
  }

  const summaryBody = document.getElementById('summaryBody');

  summaryBody.innerHTML = '';

  for (const summary of activeSummary) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${summary.category}</td>
      <td>${summary.activeCount}</td>
      <td>
        ${archivedSummary
    .find(item => item.category === summary.category).archivedCount || 0}
      </td>
    `;
    summaryBody.appendChild(row);
  }
}

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
  updateSummaryTable();
}

document.getElementById('addNoteBtn').addEventListener('click', addNote);

renderNotes();
updateSummaryTable();
