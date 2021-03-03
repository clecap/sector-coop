// THIS SCRIPT IS CURRENTLY OUT OF USE

var identityServer = "http://localhost:3000/logout";

/* $(function () {
    $("#logout-button").on('click', function(e) {
       e.preventDefault();
        
}); */

$.ajax({
    type: "GET",
    url: identityServer,
    statusCode: {
        200: function() {
            //successful logout. redirecting to main page...
            location.replace = '../../index.html';
        },
        500: function() {
          alert("We are very sorry, but we encountered some issues on our side. To make sure your request has the intended consequences, please clear your cookies for our website. We apologize for the inconvenience.");
          location.replace = '../../index.html';
        }
    }
})
