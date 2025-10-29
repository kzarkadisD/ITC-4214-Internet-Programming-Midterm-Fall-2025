// Newsletter Script

$(document).ready(function () {
  $("#newsletterForm").on("submit", function (event) {
    event.preventDefault();

    const name = $("#userName").val();
    const email = $("#userEmail").val();

    alert(
      `📬 Thank you, ${name}!\n\n You have subscribed with: ${email}\n\n For More Information Visit the FAQs\n`
    );

    $(this).trigger("reset"); // Clear form
  });
});
