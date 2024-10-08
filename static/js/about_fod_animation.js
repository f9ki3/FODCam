$(document).ready(function() {
    setInterval(function() {
        $('#div1').fadeToggle(1000); // Fade out/in div1
        $('#div2').fadeToggle(1000); // Fade out/in div2
    }, 3000); // Change every 3 seconds
});

// Function to switch to About 1 section
function about1() {
    $('#about2').hide();
    $('#about1').show();
}

// Function to switch to About 2 section
function about2() {
    $('#about1').hide(); // Ensure about1 is hidden first
    $('#about2').show(); // Then show about2
}
