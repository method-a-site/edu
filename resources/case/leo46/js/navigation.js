document.addEventListener('DOMContentLoaded', function() {
  const details = document.querySelectorAll('details');
  
  details.forEach(detail => {
    const submenu = detail.querySelector('.submenu');
    const summary = detail.querySelector('summary');
    
    // Изначально скрываем подменю
    gsap.set(submenu, { height: 0, opacity: 0 });
    
    summary.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (detail.hasAttribute('open')) {
        // Закрываем подменю
        gsap.to(submenu, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "none",
          onComplete: () => {
            detail.removeAttribute('open');
          }
        });
      } else {
        // Закрываем все остальные открытые подменю
        details.forEach(otherDetail => {
          if (otherDetail !== detail && otherDetail.hasAttribute('open')) {
            const otherSubmenu = otherDetail.querySelector('.submenu');
            gsap.to(otherSubmenu, {
              height: 0,
              opacity: 0,
              duration: 0.2,
              ease: "none",
              onComplete: () => {
                otherDetail.removeAttribute('open');
              }
            });
          }
        });
        
        // Открываем текущее подменю
        detail.setAttribute('open', '');
        
        // Получаем естественную высоту контента
        gsap.set(submenu, { height: 'auto' });
        const naturalHeight = submenu.offsetHeight;
        gsap.set(submenu, { height: 0 });
        
        gsap.to(submenu, {
          height: naturalHeight,
          opacity: 1,
          duration: 0.2,
          ease: "none"
        });
      }
    });
  });
});