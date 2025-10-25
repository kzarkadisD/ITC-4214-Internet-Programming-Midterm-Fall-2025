$(document).ready(function(){
    // Check localStorage to see if dark mode was enabled previously
    if(localStorage.getItem('darkMode') === 'enabled') {
        $('body').addClass('dark-mode');
        $('#darkModeToggle').prop('checked', true);
    }

    // Toggle dark mode on checkbox change
    $('#darkModeToggle').change(function() {
        $('body').toggleClass('dark-mode');
        
        // Save preference
        if($('body').hasClass('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
