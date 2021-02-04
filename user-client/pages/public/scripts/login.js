var loginServer = "http://127.0.0.1:6000/login";

$(function () {
    $("#login-button").on('click', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var payload = {username, password};
        
        $.post(loginServer, payload, function (data, status) {
            console.log('${data} and status is ${status}')
          });
    })
});


