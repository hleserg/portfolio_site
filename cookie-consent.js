/* Cookie Consent Banner with Accept/Reject and Analytics Gating */
(function () {
  var STORAGE_KEY = 'cookieConsent.v1';
  var GA_ID = 'G-W8VHXZJZ4W';
  var YM_ID = 103868763; // Yandex.Metrika ID used on the site

  function getState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || (data.value !== 'accepted' && data.value !== 'rejected')) return null;
      return data.value;
    } catch (e) {
      return null;
    }
  }

  function setState(value) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value: value, ts: Date.now() })
      );
    } catch (e) {}
  }

  function create(tag, props, children) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        if (k === 'class') el.className = props[k];
        else if (k === 'style') Object.assign(el.style, props[k]);
        else if (k in el) el[k] = props[k];
        else el.setAttribute(k, props[k]);
      });
    }
    (children || []).forEach(function (ch) {
      if (typeof ch === 'string') el.appendChild(document.createTextNode(ch));
      else if (ch) el.appendChild(ch);
    });
    return el;
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.add('cookie-banner--hide');
      setTimeout(function () {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      }, 250);
    }
    // Restore page transforms if we temporarily disabled them
    try {
      document.documentElement.classList.remove('cookie-consent-open');
      if (window.__cc_prevBodyTransform !== undefined) {
        document.body.style.transform = window.__cc_prevBodyTransform;
        delete window.__cc_prevBodyTransform;
      }
    } catch (e) {}
  }

  function ensureNoopAnalytics() {
    // Provide safe no-op stubs so site code can call without errors until consent
    if (typeof window.gtag === 'undefined') {
      window.gtag = function () { /* no-op until consent */ };
    }
    if (!window.dataLayer) window.dataLayer = [];
    // Do not define ym to avoid accidental initialization checks; callers should guard it
    // Additionally disable GA if browser cached previous consent as rejected
    window['ga-disable-' + GA_ID] = true;
  }

  function loadScript(src, async, onload) {
    var s = document.createElement('script');
    s.src = src;
    if (async) s.async = true;
    if (onload) s.onload = onload;
    document.head.appendChild(s);
    return s;
  }

  function enableAnalytics() {
    // Google Analytics 4
    try {
      // Allow GA
      window['ga-disable-' + GA_ID] = false;
      // Standard gtag bootstrap
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID, true, function () {
        gtag('js', new Date());
        gtag('config', GA_ID);
      });
    } catch (e) {
      console.warn('GA initialization failed:', e);
    }

    // Yandex.Metrika with error handling and fallback
    try {
      // Initialize Yandex.Metrika
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r;
        
        // Add error handling for script loading
        k.onerror = function() {
          console.warn('Yandex.Metrika script failed to load - possibly blocked by ad blocker');
          // Fallback tracking via img pixel if main script fails
          setTimeout(function() {
            if (typeof window.ym === 'undefined' || !window.ym.a) {
              var img = new Image();
              img.src = 'https://mc.yandex.ru/watch/' + YM_ID + '?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(document.title) + '&rnd=' + Math.random();
            }
          }, 1000);
        };
        
        a.parentNode.insertBefore(k,a);
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

      // Initialize with configuration
      window.ym(YM_ID, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        accurateTrackBounce: true,
        trackLinks: true
      });
      
      // Set timeout to check if Yandex.Metrika loaded successfully
      setTimeout(function() {
        if (typeof window.ym === 'undefined' || !window.ym.a) {
          console.warn('Yandex.Metrika initialization may have failed - falling back to pixel tracking');
          // Simple pixel tracking as fallback
          var img = new Image();
          img.src = 'https://mc.yandex.ru/watch/' + YM_ID + '?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(document.title) + '&rnd=' + Math.random();
        } else {
          console.info('Yandex.Metrika initialized successfully');
        }
      }, 2000);
      
    } catch (e) {
      console.warn('Yandex.Metrika initialization failed:', e);
      // Fallback pixel tracking
      try {
        var img = new Image();
        img.src = 'https://mc.yandex.ru/watch/' + YM_ID + '?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(document.title) + '&rnd=' + Math.random();
      } catch (fallbackError) {
        console.error('Even fallback tracking failed:', fallbackError);
      }
    }
  }

  function showBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    var text = create('div', { class: 'cookie-banner__text' }, [
      'Мы используем cookies, чтобы улучшить работу сайта. '
    ]);

    var acceptBtn = create('button', { class: 'btn btn--primary btn--sm', type: 'button' }, ['Принять']);
    var rejectBtn = create('button', { class: 'btn btn--outline btn--sm', type: 'button' }, ['Отклонить']);

    var buttons = create('div', { class: 'cookie-banner__buttons' }, [rejectBtn, acceptBtn]);

    var content = create('div', { class: 'cookie-banner__content' }, [text, buttons]);

    var banner = create('div', { id: 'cookie-consent-banner', class: 'cookie-banner', role: 'dialog', 'aria-live': 'polite', 'aria-label': 'Уведомление об использовании cookies' }, [content]);
    // Inline safety styles to guarantee viewport-fixed positioning on mobile
    try {
      banner.style.position = 'fixed';
      banner.style.left = '16px';
      banner.style.right = '16px';
      banner.style.bottom = 'calc(16px + env(safe-area-inset-bottom))';
      banner.style.zIndex = '2147483000';
      banner.style.pointerEvents = 'auto';
    } catch (e) {}

    acceptBtn.addEventListener('click', function () {
      setState('accepted');
      hideBanner();
      enableAnalytics();
    });

    rejectBtn.addEventListener('click', function () {
      setState('rejected');
      // Keep analytics disabled
      ensureNoopAnalytics();
      hideBanner();
    });

    // Ensure fixed positioning works relative to viewport (body has transform in site CSS)
    try {
      document.documentElement.classList.add('cookie-consent-open');
      window.__cc_prevBodyTransform = document.body.style.transform;
      document.body.style.transform = 'none';
    } catch (e) {}

    document.body.appendChild(banner);
  }

  // Public API
  window.CookieConsent = {
    get: getState,
    isDecided: function () { return getState() !== null; },
    isAccepted: function () { return getState() === 'accepted'; },
    accept: function () { setState('accepted'); enableAnalytics(); hideBanner(); },
    reject: function () { setState('rejected'); ensureNoopAnalytics(); hideBanner(); },
    show: showBanner,
    
    // Manual tracking methods that work even with ad blockers
    track: function(eventName, params) {
      if (getState() !== 'accepted') return;
      
      try {
        // Try Yandex.Metrika first
        if (typeof window.ym !== 'undefined' && window.ym.a) {
          window.ym(YM_ID, 'reachGoal', eventName, params);
        } else {
          // Fallback to pixel tracking
          var img = new Image();
          var trackingParams = 'event=' + encodeURIComponent(eventName);
          if (params) {
            trackingParams += '&params=' + encodeURIComponent(JSON.stringify(params));
          }
          img.src = 'https://mc.yandex.ru/watch/' + YM_ID + '?' + trackingParams + '&url=' + encodeURIComponent(location.href) + '&rnd=' + Math.random();
        }
        
        // Try Google Analytics
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', eventName, params);
        }
      } catch (e) {
        console.warn('Manual tracking failed:', e);
      }
    },
    
    // Page view tracking for SPAs
    trackPageView: function(page) {
      if (getState() !== 'accepted') return;
      
      try {
        if (typeof window.ym !== 'undefined' && window.ym.a) {
          window.ym(YM_ID, 'hit', page || location.href);
        } else {
          var img = new Image();
          img.src = 'https://mc.yandex.ru/watch/' + YM_ID + '?url=' + encodeURIComponent(page || location.href) + '&title=' + encodeURIComponent(document.title) + '&rnd=' + Math.random();
        }
        
        if (typeof window.gtag !== 'undefined') {
          window.gtag('config', GA_ID, { page_path: page });
        }
      } catch (e) {
        console.warn('Page view tracking failed:', e);
      }
    }
  };

  // Initialize on DOM ready
  function init() {
    var state = getState();
    if (state === 'accepted') {
      enableAnalytics();
    } else if (state === 'rejected') {
      ensureNoopAnalytics();
    } else {
      // undecided on first visit
      ensureNoopAnalytics();
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
