var SecTor = artifacts.require("SecTor");

contract('SecTor', function (accounts) {
    it("", function () {
        return SecTor.deployed().then(function (instance) {
            return instance.createPatron("some address", "some public key").call();
        }).then(function (output) {
            console.log(output);
        });
    });
});