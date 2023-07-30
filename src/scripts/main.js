'use strict';

let notesArr = [
  {
    id: 1,
    createdAt: new Date('2023-07-01 10:00'),
    content: 'Buy groceries for dinner.',
    category: 'Task',
    datesMentioned: ['2023-07-02', '2023-07-03'],
    archived: false,
  },
];

const categories = ['Task', 'Random Thought', 'Idea'];

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

function toggleArchive(noteId) {
  const note = notesArr.find(n => n.id === noteId);

  if (note) {
    note.archived = !note.archived;
    renderNotes();
    updateSummary();
  }
}

function deleteNote(noteId) {
  notesArr = notesArr.filter(note => note.id !== noteId);

  renderNotes();
  updateSummary();
}

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
