
const passwordLength = 6;

displayView = () => {

};

window.onload = () => {
    // window.alert("Hello TDDD97!");

    var token = localStorage.getItem("token");
    if (token != null) {
        //uncomment this later
        changeView("profileview");
        var activetab = localStorage.getItem("activetab");
        if (activetab != null) {
            changeContent(activetab);
        }
        else {
            localStorage.setItem("activetab", "Home");
            changeContent("Home");

        }
    }
    else {

        changeView("welcomeview");
    }
};

signout = () => {
    var token = localStorage.getItem("token");
    if (token != null) {
        localStorage.removeItem("token");
        localStorage.removeItem("activetab");
        changeView("welcomeview");
    }
}

//tab == string
//activetab == string
changeContent = (tab) => {


    //Change color of old active tab back to "unselected"
    var old_tab = document.getElementById(localStorage.getItem("activetab").toLowerCase() + "Tab");
    old_tab.style.backgroundColor = "black";
    old_tab.style.color = "white";

    //Change color of new active tab to "selected"
    var tabItem = document.getElementById(tab.toLowerCase() + "Tab");
    tabItem.style.backgroundColor = "gray";
    tabItem.style.color = "black";

    //Change active tab to new tab
    localStorage.setItem("activetab", tab);

    var htmlView = document.getElementById(tab);
    var oldView = document.getElementById("content");
    oldView.innerHTML = htmlView.innerHTML;

}

changeView = (newView) => {
    var htmlView = document.getElementById(newView);
    var oldView = document.getElementById("view");

    oldView.innerHTML = htmlView.innerHTML;
};

changePassword = () => {

    var oldpassword = document.getElementById("oldpassword").value;
    var newpassword = document.getElementById("newpassword").value;
    var repeatnewpassword = document.getElementById("repeatnewpassword").value;

    if (newpassword != repeatnewpassword) {
        //Skriv någon feedback till användaren på sidan.
        console.log("The repeated password must match the newly entered password.");

        displayErrorMessage("changePasswordError", "The repeated password must match the newly entered password.");
        return;

    }

    if (newpassword.length < passwordLength) {

        //TODO
        //Skriv någon feedback till användaren på sidan.
        console.log(`The password must be longer than ${passwordLength} characters.`);
        displayErrorMessage("changePasswordError", `The password must be longer than ${passwordLength} characters.`);
        return;
    }


    var token = localStorage.getItem("token");
    var responsefromserver = serverstub.changePassword(token, oldpassword, newpassword)
    displayErrorMessage("changePasswordError", responsefromserver.message);

}



validateLogin = () => {
    var username = document.getElementsByName("username")[0];
    var password = document.getElementsByName("password")[0];


    if (!check_email(username.value)) {
        //Skriv någon feedback till användaren på sidan.
        var errorDiv = document.getElementById("loginError");
        errorDiv.innerHTML = "Invalid email adress.";
        console.log("Invalid email adress");
        return;
    }

    if (password.value.length < passwordLength) {
        //Skriv någon feedback till användaren på sidan.
        console.log(`The password must be longer than ${passwordLength} characters.`);
        var errorDiv = document.getElementById("loginError");
        errorDiv.innerHTML = `Password is to short, should be ${passwordLength} long.`;
        return;
    }

    var response_from_server = serverstub.signIn(username.value, password.value);
    if (!response_from_server.success) {
        var errorDiv = document.getElementById("loginError");
        errorDiv.innerHTML = response_from_server.message;
        return;
    }

    localStorage.setItem("token", response_from_server.data);
    changeView("profileview");
    localStorage.setItem("activetab", "Home");
    changeContent("Home");

}

validateSignup = () => {
    //firstname
    var firstname = document.getElementsByName("firstname")[0];
    //familyname
    var familyname = document.getElementsByName("familyname")[0];
    var gender = document.getElementsByName("gender")[0];
    var password = document.getElementsByName("password")[1];
    var repeated_password = document.getElementsByName("repeatedpassword")[0];
    var email = document.getElementsByName("email")[0];
    var city = document.getElementsByName("city")[0];
    var country = document.getElementsByName("country")[0];


    if (password.value != repeated_password.value) {

        //Skriv någon feedback till användaren på sidan.
        console.log(password.value);
        console.log(repeated_password.value);
        console.log("The passwords must match");
        displayErrorMessage("signupError", "The passwords must match");

        return;
    }

    if (password.value.length < passwordLength) {

        //Skriv någon feedback till användaren på sidan.
        console.log(`The password must be longer than ${passwordLength} characters.`);
        displayErrorMessage("signupError", `The password must be longer than ${passwordLength} characters.`);
        return;
    }

    if (!check_email(email.value)) {

        //Skriv någon feedback till användaren på sidan.
        console.log("Invalid email adress.");
        displayErrorMessage("signupError", "Invalid email adress.");
        return;
    }

    var signupInfo = {
        email: email.value,
        password: password.value,
        firstname: firstname.value,
        familyname: familyname.value,
        gender: gender.value,
        city: city.value,
        country: country.value
    };

    //Communicate with backend
    var response_from_server = serverstub.signUp(signupInfo);
    if (!response_from_server.success) {
        console.log("Failed!");
        console.log(response_from_server.message);

        displayErrorMessage("signupError", response_from_server.message);
    }

};

check_email = (email) => {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return pattern.test(email);
}

displayErrorMessage = (errorDiv, message) => {
    var errorDiv = document.getElementById(errorDiv);
    errorDiv.innerHTML = message;
}
