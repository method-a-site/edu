---
---

// ВКЛЮЧИТЬ/ВЫКЛЮЧИТЬ ПЕРЕНАПРАВЛЕНИЕ
const redirectEnabled = true; // установите false чтобы отключить перенаправление

// ЗАДАТЬ СЕКРЕТНЫЙ КОД site.data.users.TEST.url
const secretKey = "{{ site.data.users.test.url | split: '?' | last | split: '=' | last }}";

  // получаем параметры из URL
  const urlParams = new URLSearchParams(window.location.search);

  // проверяем наличие кода
  if (redirectEnabled && urlParams.get("key") !== secretKey) {
    // если кода нет или он неверный → редиректим на главную
    window.location.href = "/";
  } else {
    // если ключ правильный, удаляем параметр из URL
    if (urlParams.has("key")) {
      // удаляем параметр key
      urlParams.delete("key");
      
      // формируем новый URL без параметра key
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      
      // обновляем URL без перезагрузки страницы
      window.history.replaceState(null, '', newUrl);
    }
  }

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // отменяем обычный переход
      const url = new URL(this.href, window.location.origin);

      // если параметра key ещё нет — добавляем
      if (!url.searchParams.has("key")) {
        url.searchParams.set("key", secretKey);
      }

      // открываем в новой вкладке
      window.open(url.toString(), "_blank");
    });
  });
});
