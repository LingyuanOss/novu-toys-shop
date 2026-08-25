/* ================= ABOUT CAROUSEL LOGIC (左右自动轮播) ================= */
let aboutSlideIndex = 0;
const aboutSlides = document.querySelectorAll("#aboutCarousel .slide");
const aboutDots = document.querySelectorAll("#aboutCarousel .dot");
let aboutTimer;

function showAboutSlide(index) {
  if (index >= aboutSlides.length) index = 0;
  if (index < 0) index = aboutSlides.length - 1;

  aboutSlides.forEach((slide) => slide.classList.remove("active", "prev"));
  aboutDots.forEach((dot) => dot.classList.remove("active"));

  const prevIndex = (index - 1 + aboutSlides.length) % aboutSlides.length;
  aboutSlides[prevIndex].classList.add("prev");
  aboutSlides[index].classList.add("active");

  aboutDots[index].classList.add("active");
  aboutSlideIndex = index;
}

function changeSlideAbout(step) {
  showAboutSlide(aboutSlideIndex + step);
  restartAboutTimer();
}

function setSlideAbout(index) {
  showAboutSlide(index);
  restartAboutTimer();
}

function restartAboutTimer() {
  clearInterval(aboutTimer);
  aboutTimer = setInterval(() => changeSlideAbout(1), 5000);
}

// 初始化
if (aboutSlides.length > 0) {
  showAboutSlide(0);
  restartAboutTimer();
}
