var identityServer = "http://localhost:3000/login";

$(function () {
    $("#login-button").on('click', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = window.myexports.BlindSignature.messageToHash($('#password').val());
        var payload = JSON.stringify(
            {
                "username" : username.toString(), 
                "password" : password.toString()
            });
        
        $.ajax({
            type: "POST",
            url: identityServer,
            data: payload,
            success: function(data) {alert('data: ' + data);},
            contentType: "application/json",
            dataType: "json",
            statusCode: {
                200: function() {
                    //successful login. redirecting to home page...
                    location.href = '../../private/home.html';
                    
                },
                401: function() {
                    alert("Login was unsuccessful. Please try again.");
                }
            }
        })
    })
});
