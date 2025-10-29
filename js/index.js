$(document).ready(function () {
  // ------------------------------
  // Function to render Latest Activity
  // ------------------------------
  function renderLatestActivity() {
    const activityList = $("#latestActivity");
    activityList.empty();

    // Load tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Sort tasks by due date descending
    const sortedTasks = tasks
      .slice()
      .sort((a, b) => new Date(a.due) - new Date(b.due));

    // Populate list items
    sortedTasks.forEach((task) => {
      const statusText = task.status === "Completed" ? "Completed" : "added";
      const listItem = `<li class="list-group-item">
        Task "<strong>${task.name}</strong>" ${statusText} (Priority: ${task.priority}, Due: ${task.date})
      </li>`;
      activityList.append(listItem);
    });

    // Show friendly message if no tasks
    if (sortedTasks.length === 0) {
      activityList.append(
        '<li class="list-group-item">No tasks yet. Add some from the Tasks page!</li>'
      );
    }
  }

  // ------------------------------
  // Fetch motivational quote from API
  // ------------------------------
  $.ajax({
    url: "https://api.kanye.rest/",
    method: "GET",
    success: function (data) {
      const quote = $("#quoteBlock p");

      quote
        .css({
          fontStyle: "italic",
          fontWeight: "bold",
          color: "#000000ff",
          fontSize: "1.2em",
        })
        .text(data.quote);
    },
    error: function () {
      $("#quoteBlock p").text("Stay motivated! Keep completing your tasks.");
    },
  });

  // ------------------------------
  // Initial render
  // ------------------------------
  renderLatestActivity();

  //  refresh latest activity every 5 seconds
  setInterval(renderLatestActivity, 5000);
});
