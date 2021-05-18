const hamburgerElems = document.getElementsByClassName("burger-line");
const menuNav = document.getElementById("mobile-nav");
let splits = [];

initPage(true);
barba.destroy();

// console.log(isIE);
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

function initPage(IEFlag) {
  const animText = document.querySelectorAll(".rise");
  const animStroke = document.querySelectorAll(".stroke");
  const videos = document.querySelectorAll("video");

  const observer = new IntersectionObserver(
    function addScrollClass(entries) {
      for (i = 0; i < entries.length; i++) {
        let elem = entries[i].target;
        if (entries[i].isIntersecting) {
          if (
            (entries[i].intersectionRatio >= 0.75 &&
              !elem.classList.contains("next-project")) ||
            (entries[i].intersectionRatio >= 0.25 &&
              elem.classList.contains("next-project"))
          ) {
            elem.classList.add("scrolled");
          }
        }
      }
    },
    {
      threshold: [0.15, 0.35, 0.55, 0.75, 0.95],
    }
  );

  // initialize stroke animations
  for (i = 0; i < animStroke.length; i++) {
    const strk = animStroke[i];

    // set observer on stroke
    !strk.classList.contains("scrolled")
      ? observer.observe(strk)
      : observer.unobserve(strk);
  }

  // initialize text animations
  for (i = 0; i < animText.length; i++) {
    const txt = animText[i];

    // set observer on text
    !txt.classList.contains("scrolled")
      ? observer.observe(txt)
      : observer.unobserve(txt);

    // split up text into words and lines
    const tFrag = new SplitType(txt, {
      types: ["lines", "words"],
      lineClass: "line-container",
      wordClass: "word-container",
    });

    splits.push(tFrag);
  }

  // make sure videos are playing
  if (videos) {
    for (i = 0; i < videos.length; i++) {
      if (videos[i].paused || videos[i].ended) {
        videos[i].play();
      }
    }

    if (IEFlag === true) {
      let pageContent = document.querySelector(".page-content");
      let menu = document.body.querySelectorAll(
        ".menu-home .btn, .menu-links .btn .link-container"
      );
      pageContent.style.opacity = 1;

      for (i = 0; i < menu.length; i++) {
        menu[i].style.opacity = 1;
      }
    }
  }

  window.addEventListener("resize", function () {
    // re-split text to allow for diff breakpoints
    for (i = 0; i < splits.length; i++) {
      splits[i].split();
    }

    //get rid of menu and allow scroll when the screen is resized
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
}
