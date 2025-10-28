$(document).ready(function () {
  // Load tasks from localStorage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Compute summary stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const completedTasks = totalTasks - pendingTasks;

  // Count tasks by priority
  const priorities = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach(t => { priorities[t.priority] = (priorities[t.priority] || 0) + 1; });

  // Update summary cards
  $('#totalTasks').text(totalTasks);
  $('#completedTasks').text(completedTasks);
  $('#pendingTasks').text(pendingTasks);

  // ==============================
  // Completed vs Pending Pie Chart
  // ==============================
  const statusCtx = document.getElementById('statusChart').getContext('2d');
  new Chart(statusCtx, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#28a745', '#ffc107']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // ==============================
  // Priority Distribution Bar Chart
  // ==============================
  const priorityCtx = document.getElementById('priorityChart').getContext('2d');
  new Chart(priorityCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(priorities),
      datasets: [{
        label: 'Number of Tasks',
        data: Object.values(priorities),
        backgroundColor: ['#dc3545', '#ffc107', '#0d6efd']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, precision: 0 } }
    }
  });
});