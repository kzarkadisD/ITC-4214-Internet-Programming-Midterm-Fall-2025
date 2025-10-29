//  jQuery form handling
$(document).ready(function () {
  $("#contactForm").on("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    // Get values from the form
    const name = $("#name").val();
    const email = $("#email").val();
    const subject = $("#subject").val();
    const message = $("#message").val();

    // Show user input in a popup
    alert(
      `✅ Thank you for your Feedback! Sign up for our Newsletter for Faster Updates and News \n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Subject: ${subject}\n` +
        `Message: ${message}`
    );

    $(this).trigger("reset"); // Clear form fields
  });
});