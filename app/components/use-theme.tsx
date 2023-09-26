import React, {
  useRef,
  type ReactNode,
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';
import { defaultDarkTheme, defaultLightTheme, themes } from '~/themes';

type ThemeContextType = [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

ThemeContext.displayName = 'ThemeContext';

const prefersLightMQ = '(prefers-color-scheme: light)';

export function ThemeProvider({
  children,
  themeAction = '/api/theme',
  specifiedTheme
}: {
  children: ReactNode;
  themeAction: string;
  specifiedTheme: string | null;
}) {
  const [theme, setTheme] = useState<string | null>(() => {
    if (specifiedTheme) {
      return themes.includes(specifiedTheme) ? specifiedTheme : null;
    }

    if (typeof window !== 'object') return null;
    return window.matchMedia(prefersLightMQ).matches
      ? defaultLightTheme
      : defaultDarkTheme;
  });

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch(`${themeAction}`, {
      method: 'POST',
      body: JSON.stringify({ theme })
    });
  }, [theme, themeAction]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ);
    const handleChange = () => {
      setTheme(mediaQuery.matches ? defaultLightTheme : defaultDarkTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
