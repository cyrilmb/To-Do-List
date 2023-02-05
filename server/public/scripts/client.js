$(document).ready(onReady);

function onReady() {
  console.log(`in onReady`);

  getList();

  $('#addBut').on('click', addTask);
  $(document).on('click', '.edit-btn', onEdit);
  $(document).on('click', '.accept-btn', acceptEdit);
  $(document).on('click', '.cancel-btn', cancelEdit);
  $(document).on('click', '.delete-btn', deleteTask);
  $(document).on('click', '.compBut', compTask);
}

//EDIT task
let editId = -1;

function onEdit() {
  editId = $(this).parents('tr').data('id');
  getList();
}

function cancelEdit() {
  editId = -1;
  getList();
}

//PUT edit
function acceptEdit() {
  console.log($('.date-in').val());
  editId = -1;
  let id = $(this).parents('tr').data('id');
  let task = $('.task-in').val();
  let deadline = new Date($('.date-in').val()).toISOString().split('T')[0];

  $.ajax({
    type: 'PUT',
    url: `/list/edit/${id}`,
    data: { task, deadline },
  })
    .then(function (response) {
      console.log('Response from server.', response);
      getList();
    })
    .catch(function (err) {
      console.log('Error in PUT', err);
      alert('Unable to edit task. Please try again later.');
    });
}
//end EDIT task

//Mark Complete
function compTask() {
  console.log('In compTask', $('.compBut'));

  let id = $(this).parents('tr').data('id');
  let isComplete = $(this).parents('tr').data('complete');
  console.log('Task complete bool:', isComplete);

  $.ajax({
    type: 'PUT',
    url: `list/${id}`,
    data: { complete: !isComplete },
  })
    .then((response) => {
      getList();
    })
    .catch((err) => {
      console.log('compTask error', err);
    });
}

//POST
function addTask() {
  let newDate = $('#dateInput').val();
  let taskObj = {
    task: $('#taskInput').val(),
    deadline: newDate,
    complete: false,
  };
  console.log('in addTask', taskObj);

  $.ajax({
    type: 'POST',
    url: '/list/',
    data: taskObj,
  })
    .then(function (response) {
      $('#taskInput').val('');
      $('#dateInput').val('');
      getList();
    })
    .catch((err) => {
      alert('Cannot add task right now', err);
    });
}

//GET ajax
function getList() {
  console.log('in getList');
  $.ajax({
    method: 'GET',
    url: '/list/',
  }).then((response) => {
    console.log(`in getList;`, response);
    render(response);
  });
}

function deleteTask() {
  let id = $(this).parents('tr').data('id');
  $.ajax({
    method: 'DELETE',
    url: `/list/${id}`,
  })
    .then((response) => {
      console.log('Deleted task', id);
      getList();
    })
    .catch((err) => {
      console.log(err);
    });
}

//render
function render(taskList) {
  let renderElement = $(`.taskLists`);
  renderElement.empty();

  for (item of taskList) {
    let compText =
      'Task Complete! <input id="compButDone" class="compBut" type="button" value="Ope, not done...">';
    let compId = 'done';
    let listId = completeTasks;
    let dateStr = new Date(item.deadline).toLocaleString('en', {
      dateStyle: 'medium',
    });
    let isoStr = new Date(item.deadline).toISOString().split('T')[0];
    if (!item.complete) {
      compText =
        'Get it done!<input id="compButUndone" class="compBut" type="button" value="Mark Me Done!">';
      compId = 'notDone';
      listId = toDoTasks;
    }
    if (item.id == editId) {
      let appendStr = `
          <tr  id="${compId}" data-id=${item.id} data-complete="${item.complete}">
          <td>
          <input class='task-in' value="${item.task}">
          </td>
          <td>
          <input class='date-in' value="${isoStr}" type="date">
          </td>
          <td>
          ${compText}
          </td>
          <td>
          <span>
          <input class='accept-btn' type='button' value='Enter Edit'>
          <input class='cancel-btn' type='button' value='Cancel Edit'>
          </span>
          </td>
          <td>
          <input class='delete-btn' type='button' value='Remove Task'>
          </td>`;
      $(listId).append(appendStr);
    } else {
      let appendStr = `
          <tr  id="${compId}" data-id=${item.id} data-complete=${item.complete}>
          <td>
          ${item.task}
          </td>
          <td>
          ${dateStr}
          </td>
          <td>
          ${compText}
          </td>
          <td>
          <input class='edit-btn' type='button' value='Edit Task'>
          </td>
          <td>
          <input class='delete-btn' type='button' value='Remove Task'>
          </td>`;
      $(listId).append(appendStr);
    }
  }
}
