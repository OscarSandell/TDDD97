displayView = () => {

};

window.onload = () => {
    // window.alert("Hello TDDD97!");
    changeView("welcomeview");
};



changeView = (newView) => {
    var htmlView = document.getElementById(newView);
    var oldView = document.getElementById("view");

    oldView.innerHTML = htmlView.innerHTML;
};


validateLogin = () => {
    console.log("YOlo");
    var username = document.getElementsByName("username")[0];
    var password = document.getElementsByName("password")[0];
    console.log(username.value);
    console.log(password.value);
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    console.log(pattern.test(username));
    
}