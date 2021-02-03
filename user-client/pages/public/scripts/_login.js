const bcrypt = require('bcrypt');

$(function () {
    $("#login-button").on('click', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var hash = hashPassword(password);
        alert("Username: " + username + ", Password: " + hash);
    })
});

async function hashPassword(password) {
    var salt = await bcrypt.genSalt()
    var hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

