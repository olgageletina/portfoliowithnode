const hamburgerElems = document.getElementsByClassName("burger-line");
const menuNav = document.getElementById("mobile-nav");

//expanding and folding mobile nav
function toggleNav() {
  if (!menuNav.classList.contains("active")) {
    menuNav.classList.add("active");

    //iterate through node list as if it was an array
    Array.prototype.forEach.call(hamburgerElems, function (elem) {
      elem.classList.add("active");
      if (elem.classList.contains("inactive")) {
        elem.classList.remove("inactive");
      }
    });

    document.body.classList.add("no-scroll");
  } else {
    menuNav.classList.remove("active");

    Array.prototype.forEach.call(hamburgerElems, function (elem) {
      elem.classList.remove("active");
      elem.classList.add("inactive");
    });

    document.body.classList.remove("no-scroll");
  }
}

//get rid of menu and allow scroll when the screen is resized
window.addEventListener("resize", function () {
  windowWidth = window.innerWidth;
  if (windowWidth > 768) {
    if (menuNav.classList.contains("active")) {
      menuNav.classList.remove("active");

      document.body.classList.remove("no-scroll");
      Array.prototype.forEach.call(hamburgerElems, function (elem) {
        elem.classList.remove("active");
      });
    }
  }
});
