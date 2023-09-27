import clsx from 'classnames';
import { darkThemes } from '~/themes';
import { useTheme } from './use-theme';

export default function BackgroundImage() {
  const [theme] = useTheme();

  return (
    <div
      id='background'
      className={clsx({
        dark: darkThemes.includes(theme)
      })}></div>
  );
}
