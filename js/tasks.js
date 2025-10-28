$(document).ready(function () {

  const today = new Date().toISOString().split('T')[0];6
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    const filter = $('#filterStatus').val();
    const sort = $('#sortBy').val();
    const tbody = $('#taskList');
    tbody.empty();

    let filtered = [...tasks];

    if (filter === 'pending') filtered = filtered.filter(t => t.status === 'Pending');
    if (filter === 'completed') filtered = filtered.filter(t => t.status === 'Completed');

    if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'date') filtered.sort((a, b) => {
      const da = a.date ? new Date(a.date) : Infinity;
      const db = b.date ? new Date(b.date) : Infinity;
      return da - db;
    });

    filtered.forEach((task, index) => {
      const row = `<tr data-id="${task.id}">
        <td>${task.name}</td>
        <td>${task.description}</td>
        <td>${task.CurrentDate}</td>
        <td>${task.date || '-'}</td>
        <td><span class="badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}">${task.priority}</span></td>
        <td>${task.status}</td>
        <td>
          <button class="btn btn-success btn-sm completeBtn" ${task.status === 'Completed' ? 'disabled' : ''}>✔</button>
          <button class="btn btn-primary btn-sm editBtn">✏</button>
          <button class="btn btn-danger btn-sm deleteBtn">🗑</button>
        </td>
      </tr>`;
      tbody.append(row);
    });

    updateSummary();
  }

  function updateSummary() {
    $('#totalTasks').text(tasks.length);
    $('#completedTasks').text(tasks.filter(t => t.status === 'Completed').length);
    $('#pendingTasks').text(tasks.filter(t => t.status === 'Pending').length);
  }

  function logActivity(msg) {
    const acts = JSON.parse(localStorage.getItem('activities')) || [];
    acts.unshift(`${new Date().toLocaleString()}: ${msg}`);
    localStorage.setItem('activities', JSON.stringify(acts));
  }

  // Add task
  $('#taskForm').submit(function (e) {
    e.preventDefault();

    const name = $('#taskName').val().trim();
    const desc = $('#taskDesc').val().trim();
    if (!name || !desc) return alert('Fill all fields');
    const task = {
      id: Date.now(),
      name,
      description: desc,
      CurrentDate: today,
      date: $('#taskDue').val(),
      priority: $('#taskPriority').val(),
      status: 'Pending'
    };
    tasks.push(task);
    saveTasks();
    logActivity(`Added task: ${name}`);
    this.reset();
    $('#taskCurrentDate').val(today);
    renderTasks();
  });

  // Complete task
  $('#taskList').on('click', '.completeBtn', function () {
    const id = $(this).closest('tr').data('id');
    const task = tasks.find(t => t.id === id);
    task.status = 'Completed';
    saveTasks();
    logActivity(`Completed task: ${task.name}`);
    renderTasks();
  });

  // Delete task
  $('#taskList').on('click', '.deleteBtn', function () {
    const id = $(this).closest('tr').data('id');
    const idx = tasks.findIndex(t => t.id === id);
    if (confirm(`Delete task "${tasks[idx].name}"?`)) {
      logActivity(`Deleted task: ${tasks[idx].name}`);
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    }
  });

  // Edit task
  let editId = null;
  $('#taskList').on('click', '.editBtn', function () {
    editId = $(this).closest('tr').data('id');
    const task = tasks.find(t => t.id === editId);
    $('#editTaskName').val(task.name);
    $('#editTaskDesc').val(task.description);
    $('#editTaskDate').val(task.date);
    $('#editTaskPriority').val(task.priority);
    new bootstrap.Modal(document.getElementById('editTaskModal')).show();
  });

  $('#saveEditBtn').click(function () {
    if (editId === null) return;
    const task = tasks.find(t => t.id === editId);
    const name = $('#editTaskName').val().trim();
    const desc = $('#editTaskDesc').val().trim();
    if (!name || !desc) return alert('Fill all fields');
    task.name = name;
    task.description = desc;
    task.date = $('#editTaskDate').val();
    task.priority = $('#editTaskPriority').val();
    saveTasks();
    renderTasks();
    logActivity(`Edited task: ${task.name}`);
    bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
    editId = null;
  });

  // Filters & sort
  $('#filterStatus,#sortBy').change(renderTasks);

  renderTasks();
});