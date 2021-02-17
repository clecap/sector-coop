var identityServer = "http://localhost:8000/login";

$(function () {
    $("#login-button").on('click', function(e) {
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
            dataType: "json"
        })
    })
});