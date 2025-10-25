/* ==================================================== */
/* Orion Taskworks - tasks.js                           */
/* Handles task creation, editing, deleting, completion, */
/* filtering, sorting, and localStorage persistence.     */
/* ==================================================== */

$(document).ready(function () {

  // -------------------------------
  // INITIALIZATION AND HELPERS
  // -------------------------------
  const today = new Date().toISOString().split('T')[0];
      $('#taskCurrentDate').val(today);

  // Load saved tasks from localStorage or initialize empty array
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Function to save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to render all tasks into the table dynamically
  function renderTasks() {
    $('#taskList').empty();

    // Retrieve selected filters and sorting preferences
    const filter = $('#filterStatus').val();
    const sort = $('#sortBy').val();

    let filteredTasks = [...tasks];

    // Filter tasks by completion status
    if (filter === 'completed') filteredTasks = filteredTasks.filter(t => t.status === 'Completed');
    if (filter === 'pending') filteredTasks = filteredTasks.filter(t => t.status === 'Pending');

    // Sort tasks alphabetically or by date
    if (sort === 'name') filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'date') filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Loop through and append rows to the table
    filteredTasks.forEach((task, index) => {
      const row = `
        <tr data-index="${index}" class="${task.status === 'Completed' ? 'table-success' : ''}">
          <td>${task.name}</td>
          <td>${task.description}</td>
          <td>${task.CurrentDate}</td>
          <td>${task.date}</td>
          <td><span class="badge bg-${
            task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'
          }">${task.priority}</span></td>
          <td>${task.status}</td>
          <td>
            <button class="btn btn-sm btn-success completeBtn">✔</button>
            <button class="btn btn-sm btn-primary editBtn">✏</button>
            <button class="btn btn-sm btn-danger deleteBtn">🗑</button>
          </td>
        </tr>`;
      $('#taskList').append(row);
    });

    updateSummary();
  }

  // Update dashboard counts
  function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;

    $('#totalTasks').text(total);
    $('#completedTasks').text(completed);
    $('#pendingTasks').text(pending);
  }

  // -------------------------------
  // ADD NEW TASK
  // -------------------------------
  $('#taskForm').on('submit', function (e) {
    e.preventDefault();

    // Collect form values
    const task = {
      name: $('#taskName').val(),
      description: $('#taskDesc').val(),
      CurrentDate: $('#taskCurrentDate').val(),
      date: $('#taskDate').val(),
      priority: $('#taskPriority').val(),
      status: 'Pending'
    };

    // Add to array and save
    tasks.push(task);
    saveTasks();

    // Log activity for home page “Latest Activity”
    logActivity(`Added new task: ${task.name}`);

    // Reset form and re-render
    this.reset();
    $('#taskCurrentDate').val(today);
    renderTasks();
  });

  // -------------------------------
  // COMPLETE TASK
  // -------------------------------
  $('#taskList').on('click', '.completeBtn', function () {
    const index = $(this).closest('tr').data('index');
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
    logActivity(`Deleted task: ${tasks[index].name}`);
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  // -------------------------------
  // EDIT TASK
  // -------------------------------
  $('#taskList').on('click', '.editBtn', function () {
    const index = $(this).closest('tr').data('index');
    const task = tasks[index];

    // Pre-fill form with task data
    $('#taskName').val(task.name);
    $('#taskDesc').val(task.description);
  //  $('#taskCurrentDate').val(today);                                   comment
    $('#taskDate').val(task.date);
    $('#taskPriority').val(task.priority);

    // Remove old task and save updated later
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  // -------------------------------
  // FILTER & SORT LISTENERS
  // ---------------  ----------------
  $('#filterStatus, #sortBy').on('change', renderTasks);

  // -------------------------------
  // LOG ACTIVITY TO LOCALSTORAGE
  // Used by index.html Latest Activity section
  // -------------------------------
  function logActivity(message) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const timestamp = new Date().toLocaleString();
    activities.unshift(`${timestamp}: ${message}`);
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  // -------------------------------
  // INITIAL RENDER
  // -------------------------------
  renderTasks();
});
