---
---

// Объект с пользователями, паролями и URL для перенаправления
const users = {{ site.data.users | jsonify }};

// Функция для очистки полей формы
function clearFields() {
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}

function loginCheck() {
  const user = document.getElementById('login-user').value.toLowerCase();
  const pass = document.getElementById('login-pass').value.toLowerCase();
  
  // Проверяем пользователя с учетом нормализации регистра
  const normalizedUsers = Object.keys(users).reduce((acc, key) => {
    acc[key.toLowerCase()] = {
      pass: users[key].pass.toLowerCase(),
      url: users[key].url
    };
    return acc;
  }, {});
  
  if (normalizedUsers[user] && normalizedUsers[user].pass === pass) {
    // Находим оригинальный ключ пользователя для получения URL
    const originalUserKey = Object.keys(users).find(key => key.toLowerCase() === user);
    window.location.href = users[originalUserKey].url;
  } else {
    document.getElementById('login-error').classList.remove('hidden');
    clearFields();
  }
}

// Функция для установки приветствия
function setTimeBasedGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greetingElement = document.getElementById('greeting-title');
  
  let greeting;
  if (hour >= 5 && hour < 12) {
    greeting = 'Доброе утро!';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Добрый день!';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Добрый вечер!';
  } else {
    greeting = 'Доброй ночи!';
  }
  
  greetingElement.innerHTML = greeting + '<span class="wave-animation">👋</span>';
}

// Устанавливаем приветствие до загрузки DOM
setTimeBasedGreeting();

// Добавляем обработчик для входа по Enter
document.addEventListener('DOMContentLoaded', function() {
  const loginInput = document.getElementById('login-user');
  const passInput = document.getElementById('login-pass');
  
  clearFields();
  window.addEventListener('pageshow', clearFields);
  
  [loginInput, passInput].forEach(input => {
    input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') loginCheck();
    });
  });
});
