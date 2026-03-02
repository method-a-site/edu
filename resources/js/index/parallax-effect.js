// Параллакс эффект для изображений в карточках постов
class ParallaxEffect {
  constructor() {
    this.images = document.querySelectorAll('.parallax-img');
    this.init();
  }

  init() {
    // Используем Intersection Observer для оптимизации
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.observedImages.add(entry.target);
        } else {
          this.observedImages.delete(entry.target);
        }
      });
    });

    this.observedImages = new Set();

    // Наблюдаем за всеми изображениями с классом parallax-img
    this.images.forEach(img => {
      this.observer.observe(img);
      // Устанавливаем начальные стили (изображение уже увеличено в HTML)
      img.style.transition = 'transform 0.1s ease-out';
    });

    // Добавляем обработчик прокрутки
    this.handleScroll = this.throttle(this.onScroll.bind(this), 16); // ~60fps
    window.addEventListener('scroll', this.handleScroll);
  }

  onScroll() {
    this.observedImages.forEach(img => {
      const rect = img.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Вычисляем позицию элемента относительно видимой области
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Создаем эффект параллакса только если элемент виден
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // Вычисляем прогресс прокрутки более агрессивно
        const scrollProgress = (windowHeight - elementTop) / (windowHeight + elementHeight);

        // Увеличиваем смещение (максимум 50px) и делаем эффект более заметным
        const maxOffset = 50;
        const translateY = (scrollProgress - 0.5) * maxOffset * 2;
        
        // Применяем трансформацию (сохраняем изначальное масштабирование 1.1)
        img.style.transform = `translateY(${translateY}px) scale(1.1)`;
      }
    });
  }

  // Функция throttle для оптимизации производительности
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Метод для удаления обработчиков (если нужно)
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    this.observer.disconnect();
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  new ParallaxEffect();
});