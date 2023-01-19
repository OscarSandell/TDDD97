
const passwordLength = 6;
let searchedUser = "";

window.onload = () => {
    displayView();
};

displayView = () => {
    let token = localStorage.getItem("token");
    //If a token is not found, send user to the welcomeview
    if (token == null) {
        changeView("welcomeview");
        return;
    }

    changeView("profileview");
    //Look in local storage to see if we have a saved active tab, if so change to it on load.
    let activetab = localStorage.getItem("activetab");
    if (activetab != null) {
        changeContent(activetab);
        return;
    }
    localStorage.setItem("activetab", "Home");
    changeContent("Home");

};


browseUser = () => {
    //Validate email
    let useremail = document.getElementById("LookupUser").value;
    if (!validateEmail(useremail)) {
        displayErrorMessage("searchError", "Invalid Email format!");
        return;
    }

    //Try to retreive userdata by email
    let token = localStorage.getItem("token");
    let serverresponse = serverstub.getUserDataByEmail(token, useremail);
    if (!serverresponse.success) {
        displayErrorMessage("searchError", serverresponse.message);
        return;
    }

    //Lägg till alla medelanden så man kan se dem
    clearErrorMessage("searchError");
    searchedUser = useremail;

    //Show the searched wall
    let profileInfo = document.getElementById("browseprofileinfo")
    let post = document.getElementById("browsepost");
    let wall = document.getElementById("browsewall");
    profileInfo.style.display = "block";
    post.style.display = "block";
    wall.style.display = "block";

    //Update the value of each field in the profile info.
    for (let p of profileInfo.getElementsByTagName("p")) {
        p.childNodes[0].data = p.childNodes[0].data + ": " + serverresponse.data[p.childNodes[0].data];
        p.childNodes[0].data = p.childNodes[0].data[0].toUpperCase() + p.childNodes[0].data.substring(1);
        console.log(p.childNodes[0].data);
    }

    updateWall("browse");
}

//Format of a wall post
wallPost = (writer, content) => {
    return (`
    <li >
    <div class="wallmessage">
    <div id="messageWriter">
    ${writer}
    </div>
    <div id="messageContent">
    ${content}
    </div>
    </div>
    </li>
    `)
}


//Code that should be run when we're in the home tab
home_content = () => {
    let profileInfo = document.getElementById("profileinfo").querySelectorAll("p[id]");
    console.log(profileInfo);
    let token = localStorage.getItem("token");

    let userData = serverstub.getUserDataByToken(token);
    console.log(userData.data);
    for (let p of profileInfo) {
        let length = p.previousElementSibling.firstChild.data.length;
        let lowerCase = p.previousElementSibling.firstChild.data.toLowerCase();
        let foo = lowerCase.substring(0,length-1);
        p.textContent = userData.data[foo];
    }

    updateWall("home");

}

//Code that should be run when we're in the browse tab
browse_content = () => {
    let profileInfo = document.getElementById("browseprofileinfo")
    let post = document.getElementById("browsepost");
    let wall = document.getElementById("browsewall");
    profileInfo.style.display = "none";
    post.style.display = "none";
    wall.style.display = "none";
}


//Dictionary of the different callbacks that should be run when we change tab.
let dict = { "Home": home_content, "Browse": browse_content };


newPost = (wall) => {

    let postarea = document.getElementById("postarea");
    let token = localStorage.getItem("token");
    let email = "";

    //Get email depending on which wall is relevant
    if (wall == "home") {
        email = serverstub.getUserDataByToken(token).data.email;
    }
    else if (wall == "browse") {
        email = serverstub.getUserDataByEmail(token, searchedUser).data.email;
    }
    else {
        console.log(`Error: There is no ${wall}-wall.`);
        return;
    }

    //PostMessage
    //NOTE
    //This is where SQL injections might happen
    let postreturn = serverstub.postMessage(token, postarea.value, email);
    if (postreturn.success) {
        //Reset the postarea to empty when successfully posted a message.
        postarea.value = "";
        updateWall(wall);
    }

    //TODO 
    //lägg till en errordiv bredvid postknappen, säg till om posten faila
}


//Update the wall 
updateWall = (wall) => {
    let messages = "";

    //Get messages depending on which wall is relevant
    if (wall == "home") {

        messages = serverstub.getUserMessagesByToken(localStorage.getItem("token")).data;
    }
    else if (wall == "browse") {
        messages = serverstub.getUserMessagesByEmail(localStorage.getItem("token"), searchedUser).data;
    }
    else {
        console.log(`Error: There is no ${wall}-wall.`);
        return;
    }
    updateWallhelper(messages);
}


//Actually post the messages to the wall using the format function above called wallPost
updateWallhelper = (messages) => {
    if (messages != null) {
        let list = document.getElementById("messages");
        let newWallListHtml = "";
        for (message of messages) {
            let wallPostHtml = wallPost(message.writer, message.content);
            newWallListHtml += wallPostHtml;
        }
        list.innerHTML = newWallListHtml;
    }
}


//Signout
signout = () => {
    let token = localStorage.getItem("token");

    if (token != null) {
        //TODO? vad händer om man failar att logga ut??
        serverstub.signOut(token);
        localStorage.removeItem("token");
        localStorage.removeItem("activetab");
        changeView("welcomeview");
    }
}

//Change content depending on which tab is active
//tab == string
//activetab == string
changeContent = (tab) => {

    //Changes color of old active tab back to "unselected"
    let old_tab = document.getElementById(localStorage.getItem("activetab").toLowerCase() + "Tab");
    old_tab.style.backgroundColor = "black";
    old_tab.style.color = "white";

    //Changes color of new active tab to "selected"
    let tabItem = document.getElementById(tab.toLowerCase() + "Tab");
    tabItem.style.backgroundColor = "gray";
    tabItem.style.color = "black";

    //Changes active tab to new tab
    localStorage.setItem("activetab", tab);

    let htmlView = document.getElementById(tab);
    let oldView = document.getElementById("content");
    oldView.innerHTML = htmlView.innerHTML;
    try {
        dict[tab]();

    } catch {
        console.log("errororor");
    }

}

//Change view depending on which view should be shown
changeView = (newView) => {
    let htmlView = document.getElementById(newView);
    let oldView = document.getElementById("view");
    oldView.innerHTML = htmlView.innerHTML;
};


//Change password
changePassword = () => {

    let oldpassword = document.getElementById("oldpassword").value;
    let newpassword = document.getElementById("newpassword").value;
    let repeatnewpassword = document.getElementById("repeatnewpassword").value;

    //Check if new password is the same as the repeated password
    if (newpassword != repeatnewpassword) {
        console.log("The repeated password must match the newly entered password.");
        displayErrorMessage("changePasswordError", "The repeated password must match the newly entered password.");
        return;
    }

    //Check if the new password's length is longer than the preset password length which can be found at the top.
    if (newpassword.length < passwordLength) {
        console.log(`The password must be longer than ${passwordLength} characters.`);
        displayErrorMessage("changePasswordError", `The password must be longer than ${passwordLength} characters.`);
        return;
    }

    //Actually change password.
    let token = localStorage.getItem("token");
    let responsefromserver = serverstub.changePassword(token, oldpassword, newpassword)
    displayErrorMessage("changePasswordError", responsefromserver.message);
}



validateLogin = () => {
    let username = document.getElementsByName("username")[0];
    let password = document.getElementsByName("password")[0];

    //Check if email is in corret format.
    if (!validateEmail(username.value)) {
        displayErrorMessage("loginError", "Invalid email adress.");
        console.log("Invalid email adress");
        return;
    }

    //Check if the password's length is longer than the preset password length which can be found at the top.
    if (password.value.length < passwordLength) {
        displayErrorMessage("loginError", `Password is to short, should be ${passwordLength} long.`);
        console.log(`The password must be longer than ${passwordLength} characters.`);
        return;
    }

    //Actually try to login
    let response_from_server = serverstub.signIn(username.value, password.value);
    if (!response_from_server.success) {
        displayErrorMessage("logginError", response_from_server.message);
        return;
    }

    //Save the token we recieved from the server in local storage.
    localStorage.setItem("token", response_from_server.data);
    changeView("profileview");

    //Save which should be the active tab so that we dont end up at the start when hitting the refresh button
    localStorage.setItem("activetab", "Home");
    changeContent("Home");
}

//Validate Signup information
validateSignup = () => {

    //Get all the inputs from the form.
    let firstname = document.getElementsByName("firstname")[0];
    let familyname = document.getElementsByName("familyname")[0];
    let gender = document.getElementsByName("gender")[0];
    let password = document.getElementsByName("password")[1];
    let repeated_password = document.getElementsByName("repeatedpassword")[0];
    let email = document.getElementsByName("email")[0];
    let city = document.getElementsByName("city")[0];
    let country = document.getElementsByName("country")[0];

    //Check if the password is the same as the repeated password.
    if (password.value != repeated_password.value) {
        displayErrorMessage("signupError", "The passwords must match");
        console.log("The passwords must match");
        return;
    }

    //Check if the password's length is longer than the preset password length, which can be found at the top.
    if (password.value.length < passwordLength) {
        displayErrorMessage("signupError", `The password must be longer than ${passwordLength} characters.`);
        console.log(`The password must be longer than ${passwordLength} characters.`);
        return;
    }

    //Check if the email is in the correct format.
    if (!validateEmail(email.value)) {

        //Skriv någon feedback till användaren på sidan.
        console.log("Invalid email adress.");
        displayErrorMessage("signupError", "Invalid email adress.");
        return;
    }

    let signupInfo = {
        email: email.value,
        password: password.value,
        firstname: firstname.value,
        familyname: familyname.value,
        gender: gender.value,
        city: city.value,
        country: country.value
    };

    //Communicate with backend
    let response_from_server = serverstub.signUp(signupInfo);
    if (!response_from_server.success) {
        displayErrorMessage("signupError", response_from_server.message);
        console.log(response_from_server.message);
    }

};

//Validate an email string using regex and a pattern
validateEmail = (email) => {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return pattern.test(email);
}

//Helpter function to display error messages to the user
displayErrorMessage = (errorDiv, message) => {
    errorDiv = document.getElementById(errorDiv);
    errorDiv.innerHTML = message;
}

//Helper function to clear the placeholder errorDiv
clearErrorMessage = (errorDiv) => {
    errorDiv = document.getElementById(errorDiv)
    errorDiv.innerHTML = "";
}