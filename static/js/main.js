const projects = document.getElementById("landing-body");
const nav = document.getElementById("bottom-nav");
const footer = document.querySelector("footer");
let windowHeight = window.innerHeight;
let projectsHeight, navHeight, totalOffset;
let paddingHeight;

window.addEventListener("load", function () {
  projectsHeight = projects.clientHeight;
  navHeight = nav.clientHeight;
  totalOffset = projectsHeight - windowHeight + navHeight;

  window.onscroll = function () {
    stickNav();
  };
});

window.addEventListener("resize", function () {
  projectsHeight = projects.clientHeight;
  navHeight = nav.clientHeight;
  windowHeight = window.innerHeight;
  totalOffset = projectsHeight - windowHeight + navHeight;
});

function stickNav() {
  if (window.pageYOffset > totalOffset) {
    nav.classList.remove("sticky");
    footer.style.marginTop = 0;
  } else {
    nav.classList.add("sticky");
    footer.style.marginTop = navHeight + "px";
  }
}
