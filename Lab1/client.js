
const passwordLength = 6;

displayView = () => {

};

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

home_content = () => {
    let profileInfo = document.getElementById("profileinfo").getElementsByTagName("p");
    let token = localStorage.getItem("token");

    let userData = serverstub.getUserDataByToken(token);
    for (let p of profileInfo) {
        p.childNodes[0].data = p.childNodes[0].data + ": " + userData.data[p.childNodes[0].data];
        p.childNodes[0].data = p.childNodes[0].data[0].toUpperCase() + p.childNodes[0].data.substring(1);
        console.log(p.childNodes[0].data);
    }

    updateWall();

}

let dict = { "Home": home_content };

newPost = () => {
    let postarea = document.getElementById("postarea");
    let token = localStorage.getItem("token");
    let email = serverstub.getUserDataByToken(token).data.email;
    //NOTE
    //This is where SQL injections might happen
    let postreturn = serverstub.postMessage(token, postarea.value, email);
    if (postreturn.success) {
        postarea.value = "";
        updateWall();
    }
    //TODO lägg till en errordiv bredvid postknappen, säg till om posten faila
}

updateWall = () => {
    let messages = serverstub.getUserMessagesByToken(localStorage.getItem("token")).data;
    if (messages != null) {
        let list = document.getElementById("messages");
        let newWallListHtml = "";
        for (message of messages) {
            let wallPostHtml = wallPost(message.writer,message.content);
            newWallListHtml += wallPostHtml;
        }
        list.innerHTML = newWallListHtml;
    }
}


window.onload = () => {
    let token = localStorage.getItem("token");
    if (token != null) {
        //uncomment this later
        changeView("profileview");
        let activetab = localStorage.getItem("activetab");
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
    let token = localStorage.getItem("token");
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
    let old_tab = document.getElementById(localStorage.getItem("activetab").toLowerCase() + "Tab");
    old_tab.style.backgroundColor = "black";
    old_tab.style.color = "white";

    //Change color of new active tab to "selected"
    let tabItem = document.getElementById(tab.toLowerCase() + "Tab");
    tabItem.style.backgroundColor = "gray";
    tabItem.style.color = "black";

    //Change active tab to new tab
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

changeView = (newView) => {
    let htmlView = document.getElementById(newView);
    let oldView = document.getElementById("view");

    oldView.innerHTML = htmlView.innerHTML;
};

changePassword = () => {

    let oldpassword = document.getElementById("oldpassword").value;
    let newpassword = document.getElementById("newpassword").value;
    let repeatnewpassword = document.getElementById("repeatnewpassword").value;

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


    let token = localStorage.getItem("token");
    let responsefromserver = serverstub.changePassword(token, oldpassword, newpassword)
    displayErrorMessage("changePasswordError", responsefromserver.message);

}



validateLogin = () => {
    let username = document.getElementsByName("username")[0];
    let password = document.getElementsByName("password")[0];


    if (!check_email(username.value)) {
        //Skriv någon feedback till användaren på sidan.
        let errorDiv = document.getElementById("loginError");
        errorDiv.innerHTML = "Invalid email adress.";
        console.log("Invalid email adress");
        return;
    }

    if (password.value.length < passwordLength) {
        //Skriv någon feedback till användaren på sidan.
        console.log(`The password must be longer than ${passwordLength} characters.`);
        let errorDiv = document.getElementById("loginError");
        errorDiv.innerHTML = `Password is to short, should be ${passwordLength} long.`;
        return;
    }

    let response_from_server = serverstub.signIn(username.value, password.value);
    if (!response_from_server.success) {
        let errorDiv = document.getElementById("loginError");
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
    let firstname = document.getElementsByName("firstname")[0];
    //familyname
    let familyname = document.getElementsByName("familyname")[0];
    let gender = document.getElementsByName("gender")[0];
    let password = document.getElementsByName("password")[1];
    let repeated_password = document.getElementsByName("repeatedpassword")[0];
    let email = document.getElementsByName("email")[0];
    let city = document.getElementsByName("city")[0];
    let country = document.getElementsByName("country")[0];


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
    errorDiv = document.getElementById(errorDiv);
    errorDiv.innerHTML = message;
}
