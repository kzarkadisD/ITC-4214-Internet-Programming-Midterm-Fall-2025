/* ==================================================== */
/* Orion Taskworks - tasks.js                           */
/* Handles task creation, editing (via modal), deleting, */
/* completion, filtering, sorting, and persistence.      */
/* ==================================================== */

$(document).ready(function () {

  // -------------------------------
  // INITIALIZATION AND HELPERS
  // -------------------------------
  const today = new Date().toISOString().split('T')[0];
  $('#taskCurrentDate').val(today);

  // const time = new Date(task.created).toLocaleString();
  // $('#taskDatetime').val(time);                                  add current time to table

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // -------------------------------
  // SAVE & LOAD FUNCTIONS
  // -------------------------------
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    const tbody = $('#taskList');
    tbody.empty();

    const filter = $('#filterStatus').val();
    const sort = $('#sortBy').val();

    let filteredTasks = [...tasks];

    // Filter tasks
    if (filter === 'completed') filteredTasks = filteredTasks.filter(t => t.status === 'Completed');
    if (filter === 'pending') filteredTasks = filteredTasks.filter(t => t.status === 'Pending');

    // Sort tasks
    if (sort === 'name') filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'due') {
      filteredTasks.sort((a, b) => {
        const parse = d => Date.parse(d) || Infinity;
        return parse(a.dueDate) - parse(b.dueDate);
      });
    }

    // Render each task row
    filteredTasks.forEach((task, index) => {
      const row = `
        <tr data-index="${index}" class="${task.status === 'Completed' ? 'table-success' : ''}">
          <td>${task.name}</td>
          <td>${task.description}</td>
          <td>${task.CurrentDate}</td>
                       
          <td>${task.dueDate || '-'}</td>
          <td>
            <span class="badge bg-${
              task.priority === 'High'
                ? 'danger'
                : task.priority === 'Medium'
                ? 'warning'
                : 'success'
            }">${task.priority}</span>
          </td>
          <td>${task.status}</td>
          <td>
            <button class="btn btn-sm btn-success completeBtn" ${task.status === 'Completed' ? 'disabled' : ''}>✔</button>
            <button class="btn btn-sm btn-primary editBtn">✏</button>
            <button class="btn btn-sm btn-danger deleteBtn">🗑</button>
          </td>
        </tr>`;
      tbody.append(row);
    });

    updateSummary();
  }

  function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;

    $('#totalTasks').text(total);
    $('#completedTasks').text(completed);
    $('#pendingTasks').text(pending);
  }

  // -------------------------------
  // ADD TASK
  // -------------------------------
  $('#taskForm').on('submit', function (e) {
    e.preventDefault();

    const name = $('#taskName').val().trim();
    const desc = $('#taskDesc').val().trim();

    if (!name || !desc) {
      alert('Please fill in all required fields.');
      return;
    }

    const task = {
      name,
      description: desc,
      CurrentDate: $('#taskCurrentDate').val(),
      Time: $('#taskDatetime').val(),
      dueDate: $('#taskDue').val(), 
      priority: $('#taskPriority').val(),
      status: 'Pending'
    };

    tasks.push(task);
    saveTasks();
    logActivity(`Added new task: ${task.name}`);

    this.reset();
    $('#taskate').val(today);
    $('#taskPriority').val('Low');  // reset priority
    $('#taskDue').val('');           // reset due date
    renderTasks();
  });

  // -------------------------------
  // COMPLETE TASK
  // -------------------------------
  $('#taskList').on('click', '.completeBtn', function () {
    const index = $(this).closest('tr').data('index');
    if (!tasks[index]) return;
    tasks[index].status = 'Completed';
    saveTasks();
    logActivity(`Completed task: ${tasks[index].name}`);
    renderTasks();
  });

  // -------------------------------
  // DELETE TASK
  // -------------------------------
  $('#taskList').on('click', '.deleteBtn', function () {
    const index = $(this).closest('tr').data('index');
    if (!tasks[index]) return;
    if (confirm(`Delete task "${tasks[index].name}"?`)) {
      logActivity(`Deleted task: ${tasks[index].name}`);
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  });

  // -------------------------------
  // EDIT TASK (Modal Version)
  // -------------------------------
  let editModalIndex = null;

  $('#taskList').on('click', '.editBtn', function () {
    editModalIndex = $(this).closest('tr').data('index');
    if (!tasks[editModalIndex]) return;

    const task = tasks[editModalIndex];

    $('#editTaskName').val(task.name);
    $('#editTaskDesc').val(task.description);
    $('#editTaskDate').val(task.dueDate);
    $('#editTaskPriority').val(task.priority);

    const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    modal.show();
  });

  $('#saveEditBtn').on('click', function () {
    if (editModalIndex == null || !tasks[editModalIndex]) return;

    const name = $('#editTaskName').val().trim();
    const desc = $('#editTaskDesc').val().trim();
    if (!name || !desc) {
      alert('Please fill in all required fields.');
      return;
    }

    tasks[editModalIndex].name = name;
    tasks[editModalIndex].description = desc;
    tasks[editModalIndex].dueDate = $('#editTaskDate').val();
    tasks[editModalIndex].priority = $('#editTaskPriority').val();

    saveTasks();
    renderTasks();
    logActivity(`Edited task: ${tasks[editModalIndex].name}`);

    const modalEl = document.getElementById('editTaskModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    editModalIndex = null;
  });

  // -------------------------------
  // FILTER & SORT LISTENERS
  // -------------------------------
  $('#filterStatus, #sortBy').on('change', renderTasks);

  // -------------------------------
  // ACTIVITY LOGGING
  // -------------------------------
  function logActivity(message) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const timestamp = new Date().toLocaleString();
    activities.unshift(`${timestamp}: ${message}`);
    if (activities.length > 100) activities.pop(); // keep log capped at 100
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  // -------------------------------
  // INITIAL RENDER
  // -------------------------------
  renderTasks();
});
