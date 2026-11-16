// Official schemes: https://guide.ncloud-docs.com/docs/ko/application-maps-url-scheme-vpc
// Android fallback: https://developer.chrome.com/docs/android/intents
export function mapDestination(webUrl, pageUrl, userAgent, maxTouchPoints = 0) {
  const url = new URL(webUrl);
  if (url.origin !== 'https://map.naver.com' || !url.pathname.startsWith('/p/search/')) return null;
  const query = decodeURIComponent(url.pathname.slice('/p/search/'.length));
  if (!query) return null;
  const params = 'query=' + encodeURIComponent(query) + '&appname=' + encodeURIComponent(pageUrl);
  const scheme = 'nmap://search?' + params;
  if (/Android/i.test(userAgent)) {
    return 'intent://search?' + params +
      '#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;' +
      'package=com.nhn.android.nmap;S.browser_fallback_url=' + encodeURIComponent(webUrl) + ';end';
  }
  if (/iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)) return scheme;
  return null;
}

// Visibility changes cancel fallback permanently, so returning from Maps never
// unexpectedly replaces the invitation. A second tap cancels the previous attempt.
export function installNaverMapLinks(win = window, doc = document) {
  let cancelPending = () => {};
  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor) return;
    let destination;
    try {
      destination = mapDestination(anchor.href, win.location.origin + win.location.pathname,
        win.navigator.userAgent, win.navigator.maxTouchPoints);
    } catch { return; }
    if (!destination) return; // Desktop and JS-free links retain normal web navigation.
    event.preventDefault();
    cancelPending();
    const webUrl = anchor.href;
    let timer;
    const cancel = () => {
      win.clearTimeout(timer);
      doc.removeEventListener('visibilitychange', onVisibility);
      win.removeEventListener('pagehide', cancel);
    };
    const onVisibility = () => { if (doc.hidden) cancel(); };
    cancelPending = cancel;
    doc.addEventListener('visibilitychange', onVisibility);
    win.addEventListener('pagehide', cancel);
    timer = win.setTimeout(() => {
      cancel();
      if (!doc.hidden) win.location.assign(webUrl);
    }, 2200);
    // Keep the original user gesture; no popup or deferred app launch in Kakao.
    try { win.location.assign(destination); }
    catch { cancel(); win.location.assign(webUrl); }
  }
  // Bubble phase preserves the ATM map's drag-cancellation capture handler.
  doc.addEventListener('click', onClick);
  return () => { cancelPending(); doc.removeEventListener('click', onClick); };
}
