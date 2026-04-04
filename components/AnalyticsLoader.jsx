'use client';

import { useEffect, useCallback } from 'react';

const CONSENT_KEY = 'selene_cookie_consent';

function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function injectScript(src, id) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function injectInlineScript(code, id) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.textContent = code;
  document.head.appendChild(script);
}

export default function AnalyticsLoader() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const loadGA4 = useCallback(() => {
    if (!gaId || document.getElementById('ga4-gtag')) return;
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, 'ga4-gtag');
    injectInlineScript(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `, 'ga4-config');
  }, [gaId]);

  const loadMetaPixel = useCallback(() => {
    if (!metaId || document.getElementById('meta-pixel-script')) return;
    injectInlineScript(`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('consent', 'grant');
      fbq('init', '${metaId}');
      fbq('track', 'PageView');
    `, 'meta-pixel-script');
  }, [metaId]);

  const applyConsent = useCallback(() => {
    const consent = getConsent();
    if (consent?.analytics) loadGA4();
    if (consent?.marketing) loadMetaPixel();
  }, [loadGA4, loadMetaPixel]);

  useEffect(() => {
    // Google Consent Mode v2 — deny by default
    if (gaId) {
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      });
      // Make gtag globally available
      if (!window.gtag) window.gtag = gtag;
    }

    // Check existing consent
    applyConsent();

    // Listen for consent changes
    const handler = () => applyConsent();
    window.addEventListener('cookieConsentChanged', handler);
    return () => window.removeEventListener('cookieConsentChanged', handler);
  }, [gaId, applyConsent]);

  return null;
}
