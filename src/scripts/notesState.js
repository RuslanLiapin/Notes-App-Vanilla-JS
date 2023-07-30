'use strict';

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

module.exports = {
  getNotesArr: () => notesArr,
  setNotesArr: (newNotesArr) => {
    notesArr.length = 0;
    newNotesArr.forEach((note) => notesArr.push(note));

    return notesArr;
  },
};
