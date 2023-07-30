'use strict';

const { getNotesArr } = require('./notesState');
const { categories } = require('./categories');

const notesArr = getNotesArr();

function renderEditableInput(value) {
  return `<input type="text" value="${value}" class="input is-small">`;
}

function renderEditableSelect(options, selectedValue) {
  const selectOptions = options.map(option =>
    `<option value="${option}"${option === selectedValue
      ? ' selected' : ''}>${option}</option>`
  ).join('');

  return `<select class="select is-small">${selectOptions}</select>`;
}

function renderNoteRow(note) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${note.createdAt.toLocaleString()}</td>
    <td class="noteContent">${note.content}</td>
    <td class="noteCategory">${note.category}</td>
    <td>${note.datesMentioned.join(', ')}</td>
    <td>
      <button data-id="${note.id}" class="button is-info editBtn">Edit</button>
      <button data-id="${note.id}" class="button ${note.archived
  ? 'is-success' : 'is-warning'
} archiveBtn">
    ${note.archived ? 'Unarchive' : 'Archive'}
      </button>
      <button
        data-id="${note.id}"
        class="button
        is-danger
        deleteBtn"
      >
        Delete
      </button>
      <button
        data-id="${note.id}"
        class="button
        is-primary
        saveBtn
        is-hidden"
      >
        Save
      </button>
      <button
        data-id="${note.id}"
        class="button
        cancelBtn
        is-hidden"
      >
        Cancel
      </button>
    </td>
  `;

  return row;
}

function updateSummary() {
  const activeSummary = [];
  const archivedSummary = [];

  for (const category of categories) {
    const countActive = notesArr
      .filter(n => n.category === category && !n.archived).length;

    const countArchived = notesArr
      .filter(n => n.category === category && n.archived).length;

    activeSummary.push({
      category,
      countActive,
    });

    archivedSummary.push({
      category,
      countArchived,
    });
  }

  const summaryBody = document.getElementById('summaryBody');

  summaryBody.innerHTML = '';

  for (const summary of activeSummary) {
    const row = document.createElement('tr');

    const archivedCount = archivedSummary
      .find(item => item.category === summary.category).countArchived || 0;

    row.innerHTML = `
      <td>${summary.category}</td>
      <td>${summary.countActive}</td>
      <td>${archivedCount}</td>
    `;

    summaryBody.appendChild(row);
  }
}

function renderNotes() {
  const notesTableBody = document.getElementById('notesBody');
  const archivedTableBody = document.getElementById('archivedBody');

  notesTableBody.innerHTML = '';
  archivedTableBody.innerHTML = '';

  for (const note of notesArr) {
    const row = renderNoteRow(note);

    if (!note.archived) {
      notesTableBody.appendChild(row);
    } else {
      archivedTableBody.appendChild(row);
    }
  }
}

module.exports = {
  renderNotes, updateSummary, renderEditableInput, renderEditableSelect,
};
