---
---
// Список авторов с их аватарами
const authors = {
  "Анастасия Меркоева": "{{ site.data_url }}/data/team/people/owner.png",
  "Мила Васильева": "{{ site.data_url }}/data/team/people/Mila.png",
  "Антонина Гарновская": "{{ site.data_url }}/data/team/people/Tonya.png",
  "Александр Сабельников": "{{ site.data_url }}/data/team/people/Alex.png",
  "Юлия Гладких": "{{ site.data_url }}/data/team/people/Julia.png",
};

// Функция для получения аватара автора
function getAuthorAvatar(authorName) {
  return authors[authorName] || null; // нет аватара по умолчанию
}

// Функция сокращения имени автора для мобильных устройств
function truncateAuthorForMobile(element, fullName) {
  const nameParts = fullName.split(' ');
  
  if (nameParts.length >= 2) {
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const shortName = `${firstName} ${lastName.charAt(0)}.`;
    
    // Функция обновления имени в зависимости от размера экрана
    function updateAuthorName() {
      // Находим текстовый узел (исключая avatar img)
      const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        if (window.innerWidth < 768) { // md breakpoint
          textNode.textContent = shortName;
        } else {
          textNode.textContent = fullName;
        }
      }
    }
    
    // Обновляем при загрузке и изменении размера
    updateAuthorName();
    window.addEventListener('resize', updateAuthorName);
  }
}

// Инициализация аватаров после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  const authorElements = document.querySelectorAll('.author-info');
  
  authorElements.forEach(element => {
    const authorName = element.dataset.author;
    const avatarUrl = getAuthorAvatar(authorName);
    
    // Создаем элемент аватара только если есть URL
    if (avatarUrl) {
      const avatar = document.createElement('img');
      avatar.src = avatarUrl;
      avatar.alt = `${authorName} avatar`;
      avatar.className = 'w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2';
      
      // Вставляем аватар в начало элемента
      element.insertBefore(avatar, element.firstChild);
    }
    
    // Применяем сокращение имени для мобильных
    truncateAuthorForMobile(element, authorName);
  });
});

