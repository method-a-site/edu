document.addEventListener('DOMContentLoaded', function() {
  const methodIcon = document.getElementById('methodIcon');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalIcon = document.getElementById('closeModalIcon');
  const content = document.getElementById('modalContent');

  function openModal(centerX, centerY) {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modalOverlay.style.background = 'var(--color-modal-background)';
    closeModalIcon.style.display = 'block';

    content.style.opacity = '1';
    content.style.transform = 'scale(1)';

    if (typeof centerX !== 'number' || typeof centerY !== 'number') {
      const iconRect = methodIcon.getBoundingClientRect();
      centerX = iconRect.left + iconRect.width / 2;
      centerY = iconRect.top + iconRect.height / 2;
    }
    const maxRadius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

    gsap.fromTo(
      modalOverlay,
      { clipPath: `circle(0px at ${centerX}px ${centerY}px)` },
      {
        clipPath: `circle(${maxRadius}px at ${centerX}px ${centerY}px)`,
        duration: 0.6,
        ease: 'power2.out'
      }
    );
  }

  function closeModal() {
    const iconRect = methodIcon.getBoundingClientRect();
    const centerX = iconRect.left + iconRect.width / 2;
    const centerY = iconRect.top + iconRect.height / 2;

    gsap.to(modalOverlay, {
      clipPath: `circle(0px at ${centerX}px ${centerY}px)`,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        modalOverlay.classList.add('hidden');
        closeModalIcon.style.display = 'none';
        modalOverlay.style.clipPath = 'none';
        modalOverlay.style.background = 'transparent';
        document.body.style.overflow = 'auto';

        content.style.opacity = '0';
        content.style.transform = 'scale(0)';
      }
    });
  }

  methodIcon.addEventListener('click', function(e) {
    const rect = methodIcon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    openModal(centerX, centerY);
  });
  closeModalIcon.addEventListener('click', closeModal);
  document.getElementById('contactsBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    openModal(centerX, centerY);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Magnet effect for all elements with magnet-text class
  const magnetLinks = document.querySelectorAll('a');
  magnetLinks.forEach(link => {
    const text = link.querySelector('.magnet-text');
    if (!text) return;
    text.style.transition = 'transform 0.25s cubic-bezier(.22,1,.36,1)';
    link.addEventListener('mousemove', function(e) {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const tx = Math.round(x * 0.08);
      text.style.transform = `translateX(${tx}px)`;
    });
    link.addEventListener('mouseleave', function() {
      text.style.transform = 'translate(0,0)';
    });
  });

  // Navigation bar hover and active state management
  const navBarAnimated = document.getElementById('navBarAnimated');
  if (!navBarAnimated) return;

  const hoverBg = navBarAnimated.querySelector('.nav-hover-bg');
  const navLinks = navBarAnimated.querySelectorAll('.nav-link');
  const activeLink = navBarAnimated.querySelector('.nav-link[data-active="true"]');
  
  // Clear conflicting inline styles
  navLinks.forEach(link => {
    link.style.removeProperty('background-color');
    link.style.removeProperty('color');
  });
  
  function moveBgToLink(link) {
    const rect = link.getBoundingClientRect();
    const parentRect = navBarAnimated.getBoundingClientRect();
    
    Object.assign(hoverBg.style, {
      width: rect.width + 'px',
      height: rect.height + 'px',
      left: (rect.left - parentRect.left) + 'px',
      top: (rect.top - parentRect.top) + 'px',
      background: 'var(--color-custom-hover)',
      opacity: '1',
      transition: 'all 0.35s cubic-bezier(.22,1,.36,1)'
    });
  }
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveBgToLink(link));
    link.addEventListener('mouseleave', () => {
      activeLink ? moveBgToLink(activeLink) : hoverBg.style.opacity = '0';
    });
  });

  // Initialize
  activeLink ? moveBgToLink(activeLink) : hoverBg.style.opacity = '0';

  // Smooth scroll for desktop devices
  let isDesktop = window.innerWidth > 768;
  let scrollPos = window.pageYOffset;
  let targetScrollPos = scrollPos;
  let smoothScrollRAF = null;
  let isAnchorScrolling = false; // Flag to prevent interference with anchor scrolling

  window.addEventListener('resize', () => {
    isDesktop = window.innerWidth > 768;
  });

  // Update targetScrollPos when external smooth-scroll.js updates the position
  let lastKnownScrollPos = scrollPos;
  const scrollObserver = setInterval(() => {
    const currentScroll = window.pageYOffset;
    if (Math.abs(currentScroll - lastKnownScrollPos) > 5 && !smoothScrollRAF) {
      // External scroll detected (e.g., from smooth-scroll.js)
      scrollPos = currentScroll;
      targetScrollPos = currentScroll;
      lastKnownScrollPos = currentScroll;
    }
  }, 100);

  function smoothScroll() {
    scrollPos += (targetScrollPos - scrollPos) * 0.1;
    
    if (Math.abs(targetScrollPos - scrollPos) < 0.5) {
      scrollPos = targetScrollPos;
      lastKnownScrollPos = scrollPos;
      smoothScrollRAF = null;
      return;
    }
    
    window.scrollTo(0, scrollPos);
    lastKnownScrollPos = scrollPos;
    smoothScrollRAF = requestAnimationFrame(smoothScroll);
  }

  if (isDesktop) {
    window.addEventListener('wheel', (e) => {
      // Don't interfere if modal is open
      if (!modalOverlay.classList.contains('hidden')) return;
      
      e.preventDefault();
      targetScrollPos += e.deltaY;
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollPos = Math.max(0, Math.min(targetScrollPos, maxScroll));
      
      if (!smoothScrollRAF) {
        smoothScrollRAF = requestAnimationFrame(smoothScroll);
      }
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      // Don't interfere if modal is open
      if (!modalOverlay.classList.contains('hidden')) return;
      
      const scrollAmount = e.key === 'ArrowDown' || e.key === 'ArrowUp' ? 100 : 
                          e.key === 'PageDown' || e.key === 'PageUp' ? window.innerHeight * 0.8 : 0;
      
      if (scrollAmount) {
        e.preventDefault();
        targetScrollPos += (e.key === 'ArrowDown' || e.key === 'PageDown') ? scrollAmount : -scrollAmount;
        
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollPos = Math.max(0, Math.min(targetScrollPos, maxScroll));
        
        if (!smoothScrollRAF) {
          smoothScrollRAF = requestAnimationFrame(smoothScroll);
        }
      }
    });
  }
});