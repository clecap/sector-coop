import "../node_modules/express";
import "../node_modules/bcrypt";


console.log("Login process initiated.")

//check login credentials
const success = function login(username, key) {
    console.log("Login process started with" + username + key)
}


if (success) {
    //let the user log in
    console.log("Login process successful.")
}
else {
    //try again, maybe?
    console.warn("Login process unsuccesful.")
} 
