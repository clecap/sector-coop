var identityServer = "http://localhost:3000/requireLogin";

$(function () {
   $.ajax({
      type: "GET",
      url: identityServer,
      statusCode: {
         200: function() {
            console.log("Successfully verified currently present login cookie.");
         },
         401: function() {
            console.log("Verification of login cookie failed. Redirecting to login page.");
            location.replace = '../../public/login.html';
         }
      }
   })
});