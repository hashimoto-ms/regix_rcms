let pastScroll = 0;
let isSp = false;
let fixBgImages = document.querySelectorAll(".js-fixed-bg");
let mm = gsap.matchMedia();

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

let passiveSupported = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        passiveSupported = true;
      },
    })
  );
} catch (err) {}
window.addEventListener(
  "scroll",
  function () {
    onScroll();
  },
  passiveSupported ? { passive: true } : false
);

document.addEventListener("DOMContentLoaded", function () {
  if (ScrollHint) {
    new ScrollHint(".js-scrollable");
  }

  onScroll();
  onResize();

  [].forEach.call(document.querySelectorAll(".js-toggle-menu"), function (el) {
    el.addEventListener("click", function (event) {
      this.classList.toggle("open");
      document.querySelectorAll(".header_right")[0].classList.toggle("open");
      document.getElementsByTagName("html")[0].classList.toggle("lock");
      event.preventDefault();
    });
  });

  [].forEach.call(document.querySelectorAll(".js-modal-open"), function (el) {
    el.addEventListener("click", function (event) {
      const trigger = this.dataset.modalTrigger;
      document.getElementById(trigger).classList.add("is-open");
      event.preventDefault();
    });
  });

  [].forEach.call(document.querySelectorAll(".js-modal-cose"), function (el) {
    el.addEventListener("click", function (event) {
      document
        .querySelectorAll(".modal.is-open")[0]
        .classList.remove("is-open");
      event.preventDefault();
    });
  });

  [].forEach.call(document.querySelectorAll(".js-toggle-faq"), function (el) {
    el.addEventListener("click", function (event) {
      this.parentNode.parentNode.classList.toggle("is-open");
      event.preventDefault();
    });
  });

  // [].forEach.call(document.querySelectorAll('a[href^="#"]'), function(el) {
  //   el.addEventListener('click', function(event) {
  //     const offset = getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset') * -1
  //     event.preventDefault()
  //     lenis.scrollTo(event.target.hash, {offset : offset})
  //   })
  // });
  gsap.utils.toArray('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: e.target.getAttribute("href"),
          offsetY: getComputedStyle(document.documentElement).getPropertyValue(
            "--anchor-offset"
          ),
          autoKill: false,
        },
      });
    });
  });

  const topPlanSlide = new Swiper(".sec-top-price_plan_items_wrap", {
    centeredSlides: true,
    slidesPerView: 1.1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      769: {
        slidesPerView: 2,
        centeredSlides: false,
      },
    },
  });

  const topPointSlide = new Swiper(".sec-top-point_point_spec_contents_wrap", {
    centeredSlides: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      641: {
        slidesPerView: 3,
        centeredSlides: false,
      },
    },
  });

  const topCaseSlide = new Swiper(".sec-top-point_point_case_slide_wrap", {
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1025: {
        slidesPerView: "auto",
      },
      600: {
        slidesPerView: 3,
        loopAdditionalSlides: 3,
        spaceBetween: 10,
      },
      599: {
        slidesPerView: 1,
        loopAdditionalSlides: 1,
      },
    },
  });

  const planMvThumbSlide = new Swiper(".sec-plan-mv_slide_thumb_wrap", {
    slidesPerView: 4,
    spaceBetween: 2,
  });
  const planMvSlide = new Swiper(".sec-plan-mv_slide_wrap", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 4,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: planMvThumbSlide,
    },
  });

  // TOP PAGE HEADER
  if (document.querySelector(".header_toc")) {
    gsap.utils.toArray(".js-toc").forEach((target) => {
      ScrollTrigger.create({
        trigger: target,
        start: "top 50%",
        toggleClass: { targets: target, className: "scrolled" },
      });
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains("scrolled")) {
          [].forEach.call(
            document.querySelectorAll(".header_toc_anchor"),
            function (el) {
              el.classList.remove("current");
            }
          );
          const target = document.querySelector(
            'a[href="#' + mutation.target.attributes["id"].value + '"]'
          );
          target.classList.add("current");
          target.parentNode.scrollIntoView();
        }
      });
    });
    const config = { attributes: true, attributeFilter: ["class"] };
    [].forEach.call(document.querySelectorAll(".js-toc"), function (el) {
      observer.observe(el, config);
    });

    let direction = 0;
    const scroll = ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction !== direction) {
          direction = self.direction;
          gsap.to(".header_toc", { autoAlpha: direction === 1 ? 1 : 0 });
        }
      },
    });
  }
});

function onScroll() {
  let scroll = window.scrollY || document.documentElement.scrollTop;
  let windowHeight = window.innerHeight;

  console.log("scroll");

  fixBgImages.forEach(function (element) {
    let bgElem = document.querySelector("." + element.dataset.targetBg);
    let elemRect = element.getBoundingClientRect();
    let elemPosTop = scroll + elemRect.top;
    let elemPosBottom = elemPosTop + elemRect.height;

    if (elemPosTop < scroll + windowHeight && elemPosBottom > scroll) {
      bgElem.classList.remove("is-hide");
      bgElem.firstElementChild.style.height = elemRect.height;
    } else {
      bgElem.classList.add("is-hide");
    }
  });

  pastScroll = scroll;
}

function onResize() {
  gsap.killTweensOf(".js-fadein");
  mm.add("(min-width: 641px)", () => {
    isSp = true;
  });
  if (isSp) {
    gsap.utils.toArray(".js-fadein").forEach((target) => {
      gsap.fromTo(
        target,
        {
          y: 30,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          delay: target.dataset.gsapDelay,
          duration: 0.5,
          scrollTrigger: {
            trigger: target,
            toggleActions: "play none none reverse",
            start: "top 70%",
            // markers: true,
          },
        }
      );
    });
  } else {
    gsap.utils.toArray(".js-fadein").forEach((target) => {
      gsap.fromTo(
        target,
        {
          y: 30,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: target,
            toggleActions: "play none none reverse",
            start: "top 80%",
            // markers: true,
          },
        }
      );
    });
  }
}
