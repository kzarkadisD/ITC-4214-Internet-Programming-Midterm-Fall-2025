    //  jQuery form handling 
$(document).ready(function () {
  $('#contactForm').on('submit', function (event) {
    event.preventDefault(); // Prevent page reload

    // Get values from the form
    const name = $('#name').val();  
    const email = $('#email').val();
    const subject = $('#subject').val();
    const message = $('#message').val();

    // Show user input in a popup
    alert(
      `✅ Your message has been captured!\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n` +
      `Message: ${message}`
    );

    $(this).trigger('reset'); // Clear form fields
  })
});