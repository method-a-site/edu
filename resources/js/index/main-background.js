// For background animation
document.addEventListener('DOMContentLoaded', function() {
  gsap.registerPlugin(ScrollTrigger);

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const bgBlend = document.querySelector('.background-blend');
  const bgBottom = document.querySelector('.background-bottom');
  
  // Проверяем что элементы существуют
  if (!bgBlend || !bgBottom) return;
  
  bgBlend.style.backgroundColor = getCssVar('--color-background-top');

  // scrub-animation background-blend - появляется при скролле 4 секции
  const scaleVal = 0.95;
  const yBlendVal = "-70vh";
  const slideSections = document.querySelectorAll('.slide-section');
  const thirdSlide = slideSections[0];

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: thirdSlide,
      start: "bottom-=200px center",
      end: "bottom center",
      scrub: true,
      //markers: true
    }
  });

  tl.to(bgBlend, {
    scale: scaleVal,
    y: yBlendVal,
    borderBottomLeftRadius: "2rem",
    borderBottomRightRadius: "2rem",
    ease: "sine.inOut"
  }, 0)
  .to(bgBottom, {
    opacity: 1
  }, 0);
});