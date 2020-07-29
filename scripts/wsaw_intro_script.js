function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        myTopButton.style.display = "block";
    } else {
        myTopButton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function homeFunction() {
    location.href = "../index.html";
}

    // Top
window.onscroll = function() {scrollFunction()};
var btn_top = document.createElement("BUTTON");
btn_top.id = "btn_top";
btn_top.innerHTML = "Top"
btn_top.onclick = function() {
    topFunction();
}
document.body.appendChild(btn_top);
let myTopButton = document.getElementById("btn_top");
    // Home
var btn_home = document.createElement("BUTTON");
btn_home.id = "btn_home";
btn_home.innerHTML = "Home"
btn_home.onclick = function() {
    homeFunction();
}
document.body.appendChild(btn_home);
let myHomeButton = document.getElementById("btn_home");
myHomeButton.style.display = "block";