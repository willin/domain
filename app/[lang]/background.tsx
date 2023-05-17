'use client';
import { darkThemes } from '@/lib/themes';
import { useEffect } from 'react';

export function BackgroundImage() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || '';
      const isDark = darkThemes.includes(theme);
      const elm = document.getElementById('background');
      if (isDark) {
        elm?.classList.add('dark');
      } else {
        elm?.classList.remove('dark');
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div id='background'></div>;
}
