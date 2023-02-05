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

//PUT ajax
function acceptEdit() {
  editId = -1;
  let id = $(this).parents('tr').data('id');
  let task = $('.taskInput').val();
  let deadline = $('.dateInput').val();
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

//POST ajax
function addTask() {
  let taskObj = {
    task: $('#taskInput').val(),
    deadline: $('#dateInput').val(),
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
  let renderElement = $(`#viewTasks`);
  renderElement.empty();

  for (item of taskList) {
    let compText =
      'Task Complete! <input class="compBut" type="button" value="Ope, not done...">';
    if (!item.complete) {
      compText = '<input class="compBut" type="button" value="Mark Me Done!">';
    }
    if (item.id == editId) {
      let appendStr = `
          <tr data-id=${item.id} data-complete="${item.complete}">
          <td>
          <input class='task-in' value="${item.task}">
          </td>
          <td>
          <input class='date-in' value="${item.deadline}" type="date">
          </td>
          <td>
          ${compText}
          </td>
          <td>
          <span>
          <input class='accept-btn' type='button' value='Enter Me!'>
          <input class='cancel-btn' type='button' value='cancel'>
          </span>
          </td>`;
      renderElement.append(appendStr);
    } else {
      let appendStr = `
          <tr data-id=${item.id} data-complete=${item.complete}>
          <td>
          ${item.task}
          </td>
          <td>
          ${item.deadline}
          </td>
          <td>
          ${compText}
          </td>
          <td>
          <span>
          <input class='edit-btn' type='button' value='Edit Task'>
          <input class='delete-btn' type='button' value='Remove Task'>
          </span>
          </td>`;
      renderElement.append(appendStr);
    }
  }
}
