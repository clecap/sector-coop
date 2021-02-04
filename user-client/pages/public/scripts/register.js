var identityServer = "http://127.0.0.1:6000/register";

$(function () {
    $("#register-button").on('click', function(e) {
        e.preventDefault();
        
        var _username = $('#username').val();
        var _password = $('#password').val();
        var payload = JSON.stringify({"username" : _username, "password" : _password});
        

        $.post(identityServer, payload, function (res) {
            console.log(res)
          },
        'json');
        
        /*$.ajax({
            type: "POST",
            url: identityServer,
            data: payload,
            success: success,
            dataType: "json"
        })*/
    })
});
