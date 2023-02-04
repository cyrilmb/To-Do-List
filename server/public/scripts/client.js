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
  }
}
