/* ==================================================== */
/* Orion Taskworks - analytics.js                        */
/* Generates dynamic charts and summaries from stored    */
/* tasks in localStorage using Chart.js.                 */
/* ==================================================== */

$(document).ready(function () {

  // Retrieve saved tasks from localStorage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // -------------------------------
  // CALCULATE STATISTICS
  // -------------------------------
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // Count number of each priority type
  const highPriority = tasks.filter(t => t.priority === 'High').length;
  const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'Low').length;

  // -------------------------------
  // UPDATE STATISTICAL CARDS
  // -------------------------------
  $('#totalTasks').text(totalTasks);
  $('#completedTasks').text(completedTasks);
  $('#pendingTasks').text(pendingTasks);

  // -------------------------------
  // INSIGHT GENERATION LOGIC
  // Simple heuristic-based insight text
  // -------------------------------
  let insight = '';
  if (totalTasks === 0) {
    insight = 'No data yet. Add some tasks to see analytics.';
  } else if (completedTasks === totalTasks) {
    insight = 'Excellent work! You’ve completed all your tasks.';
  } else if (completedTasks > pendingTasks) {
    insight = 'You’re on track — most of your tasks are done!';
  } else {
    insight = 'Keep going! Try to complete a few more tasks today.';
  }
  $('#insightText').text(insight);

  // -------------------------------
  // PIE CHART - Completion Status
  // -------------------------------
  const ctxStatus = document.getElementById('statusChart').getContext('2d');
  new Chart(ctxStatus, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#28a745', '#ffc107'], // green for completed, yellow for pending
        borderColor: ['#fff'],
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Task Completion Overview'
        }
      }
    }
  });

  // -------------------------------
  // BAR CHART - Priority Distribution
  // -------------------------------
  const ctxPriority = document.getElementById('priorityChart').getContext('2d');
  new Chart(ctxPriority, {
    type: 'bar',
    data: {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        label: 'Tasks by Priority',
        data: [highPriority, mediumPriority, lowPriority],
        backgroundColor: ['#dc3545', '#ffc107', '#28a745'], // red, yellow, green
        borderRadius: 6
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0 // Show integers only
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Priority Breakdown'
        }
      }
    }
  });
});
