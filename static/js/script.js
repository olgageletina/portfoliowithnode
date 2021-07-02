const hamburgerElems = document.getElementsByClassName("burger-line");
const menuNav = document.getElementById("mobile-nav");
let splits = [];
let clone, cloneDims, imgPos, ogImg, imgPosEndY;
const menu = document.body.querySelectorAll(
  ".menu-home .btn, .menu-links .btn .link-container"
);
const hamburger = document.body.querySelector(".hamburger");
const imgContainer = document.createElement("div");
const mainEase = CustomEase.create("M0,0 C0.19,1 0.22,1 1,1");
const contentEase = CustomEase.create(
  "M0,0 C0.29,0 0.466,0.362 0.498,0.502 0.518,0.592 0.491,0.755 0.524,0.864 0.559,0.98 0.62,1 1,1"
);
const dashEase = CustomEase.create("M0,0 C0.23,1 0.32,1 1,1)");
gsap.registerPlugin(ScrollToPlugin, CustomEase);

const opacityEnterAnim = {
  opacity: 1,
  ease: mainEase,
  duration: 0.1,
};

const transformAnim = {
  y: 0,
  ease: contentEase,
  duration: 0.275,
};

const menuAmin = {
  y: 0,
  duration: 0.5,
  ease: mainEase,
  stagger: 0.01,
};

const hamAnim = {
  x: 0,
  ease: contentEase,
  duration: 0.2,
};

barba.hooks.beforeEnter(function (data) {
  const yCoord =
    data.next.url.hash === "about" || data.next.url.hash === "contact"
      ? document.getElementById(data.next.url.hash).getBoundingClientRect().top
      : 0;
  gsap.to(window, { duration: 0.1, scrollTo: yCoord });
});

barba.init({
  transitions: [
    {
      name: "img-animation",
      custom(data) {
        return (
          data.trigger.classList &&
          data.trigger.classList.contains("project-link")
        );
      },
      leave(data) {
        clone = data.trigger.parentNode.parentNode
          .querySelector("img")
          .cloneNode(true);
        cloneDims = data.trigger.parentNode.parentNode
          .querySelector(".project-img")
          .getBoundingClientRect();

        clone.className = "";

        const containerDims =
          data.trigger.parentNode.parentNode.getBoundingClientRect();
        imgPos = containerDims.left;

        imgContainer.setAttribute("id", "interim-container");
        imgContainer.style.cssText = `width: ${containerDims.width}px; left:${imgPos}px`;

        const parent = document.body;

        const bodyRect = parent.getBoundingClientRect(),
          elemRect = document.getElementById("anchor").getBoundingClientRect();
        imgPosEndY = elemRect.top - bodyRect.top;

        imgContainer.insertBefore(clone, imgContainer.childNodes[1]);
        parent.insertBefore(imgContainer, parent.childNodes[1]);

        document.getElementById("work").classList.add("hide");

        gsap.set(clone, {
          position: "fixed",
          x: cloneDims.x,
          y: cloneDims.y,
          width: cloneDims.width,
          height: cloneDims.height,
        });
      },

      beforeEnter(data) {
        //dimensions of the project img on the project page
        ogImg = document.body.querySelector(".title-img");

        //get new dimensions add existing img into the src tag on the incoming page
        const newDims = ogImg.getBoundingClientRect();
        ogImg.src = clone.src;
        ogImg.srcset = clone.srcset;

        //remove CSS class from parent to evade the loading transition
        if (
          ogImg.parentNode.classList &&
          ogImg.parentNode.classList.contains("img-lazy")
        ) {
          ogImg.parentNode.classList.remove("img-lazy");
        }
        if (ogImg.classList && ogImg.classList.contains("lazyload")) {
          ogImg.classList.remove("lazyload");
        }

        const tl = gsap.timeline({
          onComplete() {
            data.current.container.remove();
          },
        });
        tl.set(menu, { y: "200%" })
          .to(hamburger, { x: "-120%", ease: contentEase, duration: 0.1 })
          .to(
            clone,
            {
              x: newDims.x - imgPos,
              y: imgPosEndY,
              width: newDims.width,
              height: newDims.height,
              duration: 0.6,
              ease: "power4.out",
            },
            0
          );

        return tl;
      },
      enter(data) {
        const tl = gsap.timeline({
          onComplete() {
            initPage(false);
            imgContainer.removeChild(clone);
            document.body.removeChild(imgContainer);
          },
        });

        // line up the next container and get rid of the redundant img
        tl.set(
          data.next.container,
          {
            opacity: 0,
            y: 30,
          }
        )
          .set(ogImg, { opacity: 0 })
          .to(menu, menuAmin, 0)
          .to(hamburger, hamAnim, 0.3)
          .to(data.next.container, opacityEnterAnim, 0.3)
          .to(data.next.container, transformAnim, 0.35)
          .to(ogImg, opacityEnterAnim, 0.6)
          .to(clone, { opacity: 0, duration: 0.1 });

        return tl;
      },
    },

    {
      name: "default",
      once(data) {
        const tl = gsap.timeline({
          onComplete() {
            initPage(false);
          },
        });

        tl.set(data.next.container, { y: 30, opacity: 0 })
          .set(menu, { y: "200%", opacity: 1 })
          .to(menu, menuAmin, 0.1)
          .to(data.next.container, opacityEnterAnim, 0.65)
          .to(data.next.container, transformAnim, 0.7);

        return tl;
      },
      leave(data) {
        const tl = gsap.timeline({
          onComplete() {
            data.current.container.remove();
          },
        });

        if (
          data.trigger.classList &&
          data.trigger.classList.contains("next-project-link")
        ) {
          const arrow = document.body.querySelector(".next-project .btn-arrow");

          const dash = document.body.querySelector(".dash");

          dash.classList.add("reset");
          arrow.classList.add("reset");

          tl.to(data.current.container, {
            opacity: 0,
            y: 30,
            ease: mainEase,
            duration: 0.2,
            delay: 0.55,
          })
            .set(menu, { y: "200%" })
            .to(hamburger, { x: "-120%", ease: contentEase, duration: 0.1 });
        } else {
          const transitionDelay =
            data.trigger.classList &&
            data.trigger.classList.contains("burger-link")
              ? 0.25
              : 0;

          tl.to(data.current.container, {
            opacity: 0,
            y: 30,
            ease: contentEase,
            duration: 0.2,
            delay: transitionDelay,
          });
        }
        return tl;
      },
      enter(data) {
        const tl = gsap.timeline({
          onComplete() {
            initPage(false);
          },
        });

        if (
          data.trigger.classList &&
          data.trigger.classList.contains("next-project-link")
        ) {
          tl.set(data.next.container, { y: 30, opacity: 0 })
            .to(menu, menuAmin, 0.85)
            .to(hamburger, hamAnim, 1.35)
            .to(data.next.container, opacityEnterAnim, 1.35)
            .to(data.next.container, transformAnim, 1.4);
        } else {
          tl.set(data.next.container, { y: 30, opacity: 0 })
            .to(data.next.container, opacityEnterAnim)
            .to(data.next.container, transformAnim, 0.05);
        }

        return tl;
      },
    },
  ],
  requestError: (trigger, action, url, response) => {
    if (action === "click" && response.status && response.status === 404) {
      barba.go("/404");
    } else if (
      response.status &&
      (response.status === 408 || response.status === 504)
    ) {
      window.location.reload();
      initPage(true);
    }
    return false;
  },
  logLevel: "error",
  timeout: 5000,
  // debug: true,
});

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

function initPage(showContent) {
  const animText = document.querySelectorAll(".rise");
  const animStroke = document.querySelectorAll(".stroke");
  const videos = document.querySelectorAll("video");

  const observer = new IntersectionObserver(
    function addScrollClass(entries) {
      for (i = 0; i < entries.length; i++) {
        let elem = entries[i].target;
        if (entries[i].isIntersecting) {
          if (
            (entries[i].intersectionRatio >= 0.65 &&
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

  if (showContent === true) {
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
