const nav = document.getElementById("top-nav");
let lastScroll = 0;

window.onscroll = function () {
  showNav();
};

function showNav() {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    nav.classList.remove("hide-nav-top");
    return;
  }
  if (
    currentScroll > lastScroll &&
    !nav.classList.contains("display-nav-top")
  ) {
    nav.classList.remove("hide-nav-top");
    nav.classList.add("display-nav-top");
  } else if (
    currentScroll < lastScroll &&
    nav.classList.contains("display-nav-top")
  ) {
    nav.classList.remove("display-nav-top");
    nav.classList.add("hide-nav-top");
  }
  lastScroll = currentScroll;
}
