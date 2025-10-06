---
---

// ВКЛЮЧИТЬ/ВЫКЛЮЧИТЬ ПЕРЕНАПРАВЛЕНИЕ
const redirectEnabled = true; // установите false чтобы отключить перенаправление

// ЗАДАТЬ СЕКРЕТНЫЙ КОД site.data.users.LEO46.url
const secretKey = "{{ site.data.users.leo46.url | split: '?' | last | split: '=' | last }}";

  // получаем параметры из URL
  const urlParams = new URLSearchParams(window.location.search);
  let userKey = urlParams.get("key");
  
  // получаем ключ с предыдущей страницы (если переход был с нашего сайта)
  let referrerKey = null;
  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      // проверяем, что переход был с того же домена
      if (referrerUrl.origin === window.location.origin) {
        referrerKey = new URLSearchParams(referrerUrl.search).get("key") || localStorage.getItem("userKey");
      }
    } catch (e) {
      // игнорируем ошибки парсинга URL
    }
  }

  // если ключа нет в URL, проверяем - это обновление страницы или новое открытие
  if (!userKey) {
    const savedKey = localStorage.getItem("userKey");
    const savedUrl = localStorage.getItem("currentUrl");
    const currentUrl = window.location.pathname;
    
    // проверяем тип навигации (reload = обновление страницы)
    const isPageRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload' || 
                         performance.navigation?.type === performance.navigation?.TYPE_RELOAD;
    
    // используем сохраненный ключ только если это обновление той же страницы
    if (savedKey && savedUrl === currentUrl && isPageRefresh && savedKey === secretKey) {
      userKey = savedKey;
      // добавляем ключ в URL для верификации
      urlParams.set("key", userKey);
      const newUrl = window.location.pathname + '?' + urlParams.toString();
      window.history.replaceState(null, '', newUrl);
    }
  }

  // проверяем наличие кода
  if (redirectEnabled && (!userKey || userKey !== secretKey)) {
    // очищаем localStorage при неуспешной верификации
    localStorage.removeItem("userKey");
    localStorage.removeItem("currentUrl");
    // если кода нет или он неверный → редиректим на главную
    window.location.href = "/";
  } else {
    // если ключ правильный, сохраняем его в localStorage вместе с текущим URL
    localStorage.setItem("userKey", userKey);
    localStorage.setItem("currentUrl", window.location.pathname);
    
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
      if (!url.searchParams.has("key") && userKey && userKey === secretKey) {
        url.searchParams.set("key", userKey);
      }

      // переходим в текущей вкладке
      window.location.href = url.toString();
    });
  });
});
