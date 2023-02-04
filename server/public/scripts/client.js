$(document).ready(onReady);

function onReady() {
  console.log(`in onReady`);

  $('#addBut').on('click', addTask);
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

//render
function render(taskList) {
  let renderElement = $(`#viewTasks`);
  renderElement.empty();

  for (item of taskList) {
    let compText =
      'Task Complete! <input class="compBut" type="button" value="Done!">';
    if (!item.complete) {
      compText =
        'Tackle Me! <input class="compBut" type="button" value="Not done yet!">';
    }
    if (item.id == editId) {
      let appendStr = `
          <tr data-id=${item.id} data-complete="${item.complete}">
          <td>
          <input class='task-in' value="${item.task}">
          </td>
          <td>
          <input class='date-in' value="${item.date}" type="date">
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
          ${item.date}
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
