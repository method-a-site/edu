function smoothScrollTo(y, d = 200) {
  const s = window.pageYOffset, c = y - s;
  let t;
  function scrollStep(ts) {
    if (t === undefined) t = ts;
    const p = Math.min(1, (ts - t) / d);
    window.scrollTo(0, s + c * (0.5 - 0.5 * Math.cos(Math.PI * p)));
    if (p < 1) requestAnimationFrame(scrollStep);
  }
  requestAnimationFrame(scrollStep);
}
document.querySelectorAll('a[href^="#"]').forEach(link =>
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#down') {
      e.preventDefault();
      smoothScrollTo(document.body.scrollHeight, 400);
    } else if (href === '#up') {
      e.preventDefault();
      smoothScrollTo(0, 400);
    } else if (href.length > 1) {
      e.preventDefault();
      let targetElement;
      const id = href.substring(1); // убираем символ #
      
      // Сначала пробуем getElementById - он более надежный для сложных ID
      targetElement = document.getElementById(id);
      
      if (!targetElement) {
        try {
          // Если getElementById не сработал, пробуем с CSS.escape
          const escapedSelector = '#' + CSS.escape(id);
          targetElement = document.querySelector(escapedSelector);
        } catch (error) {
          // Ошибка с querySelector - продолжаем поиск альтернативными способами
        }
      }
      
      if (targetElement) {
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(y, 400);
      } else {
        
        // Попробуем найти похожий элемент
        // Убираем дефисы из ID и ищем похожий
        const normalizedId = id.replace(/-/g, '');
        const allElements = document.querySelectorAll('[id]');
        
        for (let element of allElements) {
          const elementId = element.id.replace(/-/g, '');
          if (elementId === normalizedId || element.id.includes(id.substring(2))) {
            targetElement = element;
            break;
          }
        }
        
        if (targetElement) {
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset;
          smoothScrollTo(y, 400);
        }
      }
    }
  })
);

// Функции для управления выпадающей панелью содержания
function closeDropdown() {
  const dropdownPanel = document.getElementById('dropdownPanel');
  if (dropdownPanel) {
    dropdownPanel.classList.add('hidden');
  }
}

// Закрытие панели по клику вне её области
document.addEventListener('click', function(event) {
  const dropdownPanel = document.getElementById('dropdownPanel');
  const dropdownButton = document.getElementById('dropdownButton');
  
  if (dropdownPanel && !dropdownPanel.classList.contains('hidden')) {
    // Если клик был не по кнопке и не внутри панели
    if (!dropdownButton.contains(event.target) && !dropdownPanel.contains(event.target)) {
      dropdownPanel.classList.add('hidden');
    }
  }
});