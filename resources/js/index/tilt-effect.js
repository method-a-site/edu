// Тилт эффект для карточек постов
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('.post-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      card.addEventListener('mousemove', this.handleMouseMove.bind(this));
      card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    });
  }

  handleMouseEnter(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.1s ease-out';
  }

  handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Ограничиваем углы наклона (максимум 5 градусов)
    const rotateX = (mouseY / rect.height) * -3;
    const rotateY = (mouseX / rect.width) * 3;
    
    // Применяем трансформацию
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  handleMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.4s ease-out';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  new TiltEffect();
});