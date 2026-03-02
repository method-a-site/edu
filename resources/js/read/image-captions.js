// Автоматическое добавление подписей к изображениям
document.addEventListener('DOMContentLoaded', function() {
  const markdownBody = document.querySelector('.markdown-body');
  if (!markdownBody) return;

  const images = markdownBody.querySelectorAll('img[alt]:not([alt=""])');
  
  images.forEach(function(img) {
    // Пропускаем изображения, которые уже обёрнуты в figure
    if (img.parentElement.tagName === 'FIGURE') return;
    
    const altText = img.getAttribute('alt');
    
    // Создаём figure и figcaption
    const figure = document.createElement('figure');
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = altText;
    
    // Заменяем img на figure с img внутри
    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);
    figure.appendChild(figcaption);
  });
});
