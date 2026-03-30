'use client';

import { useEffect } from 'react';

export default function PixelViewContent({ courseId, title, price }) {
  useEffect(() => {
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {
        content_name: title,
        content_ids: [courseId],
        content_type: 'product',
        value: price / 100,
        currency: 'EUR',
      });
    }
  }, [courseId, title, price]);

  return null;
}
