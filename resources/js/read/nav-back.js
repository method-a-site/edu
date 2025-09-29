function goToPreviousPage() {
  // получаем текущий ключ из localStorage
  const userKey = localStorage.getItem("userKey");
  
  if (document.referrer && new URL(document.referrer).pathname !== location.pathname) {
    const referrerUrl = new URL(document.referrer);
    
    // добавляем ключ к URL назад, если ключ есть и это тот же домен
    if (userKey && referrerUrl.origin === window.location.origin) {
      referrerUrl.searchParams.set("key", userKey);
    }
    
    location.href = referrerUrl.toString();
  } else {
    // если идем на главную, тоже добавляем ключ
    const homeUrl = new URL('/', window.location.origin);
    if (userKey) {
      homeUrl.searchParams.set("key", userKey);
    }
    location.href = homeUrl.toString();
  }
}