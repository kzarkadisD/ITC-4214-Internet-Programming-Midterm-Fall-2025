/* ==================================================== */
/* Orion Taskworks - main.js                            */
/* ==================================================== */

$(document).ready(function() {
  /* ----------------------------------------------------
   * SECTION 1: API INTEGRATION (Motivational Quote)
   * Fetches a random motivational quote using a free API
   * and updates the page dynamically.
   ---------------------------------------------------- */
  $.getJSON('https://api.quotable.io/random', function(data) {
    // On successful response, populate quote and author
    $('#quote').text(data.content);
    $('#author').text(data.author);
  }).fail(function() {
    // Handles connection or API errors
    $('#quote').text('Unable to load quote. Please try again later.');
  });

  /* ----------------------------------------------------
   * SECTION 2: LATEST ACTIVITY
   * Loads recent user actions from localStorage and
   * displays them in the “Latest Activity” list.
   ---------------------------------------------------- */
  function loadLatestActivity() {
    // Fetch stored activities (if any)
    const activities = JSON.parse(localStorage.getItem('activities')) || [];

    // Clear any existing list items
    $('#latestActivity').empty();

    // Loop through activities and append each to the DOM
    activities.forEach(activity => {
      $('#latestActivity').append(`<li class="list-group-item">${activity}</li>`);
    });
  }

  // Load latest activities when the page is ready
  loadLatestActivity();

  /* ----------------------------------------------------
   * SECTION 3: DARK MODE TOGGLE
   * Toggles between light and dark mode, saving the
   * user’s preference to localStorage.
   ---------------------------------------------------- */
  $('#darkModeToggle').on('click', function() {
    // Determine the current theme and toggle it
    const theme = $('html').attr('data-theme') === 'dark' ? 'light' : 'dark';
    $('html').attr('data-theme', theme);

    // Save the user’s choice
    localStorage.setItem('theme', theme);
  });

  // Apply the saved theme on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    $('html').attr('data-theme', savedTheme);
  }

});
