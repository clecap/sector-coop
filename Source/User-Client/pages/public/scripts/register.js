var identityServer = "http://localhost:8000/register";

$(function () {
    $("#register-button").on('click', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
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
                201: function() {
                    alert("Registration process was succesful!");
                },
                555: function() {
                    alert("This username already exists. Please try a different one.");
                },
                500: function() {
                    alert("Something went wrong!");
                }
            }
        })
    })
});
