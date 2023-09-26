import { useEffect } from 'react';
import { darkThemes } from '~/themes';
import { useTheme } from './use-theme';

export default function BackgroundImage() {
  const [theme] = useTheme();

  useEffect(() => {
    const observer = new MutationObserver(() => {
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
  }, [theme]);

  return <div id='background'></div>;
}
