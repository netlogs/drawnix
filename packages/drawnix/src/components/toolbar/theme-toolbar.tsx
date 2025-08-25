import { useBoard } from '@plait-board/react-board';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  ThemeColorMode,
} from '@plait/core';
import { Island } from '../island';

export const ThemeToolbar = () => {
  const board = useBoard();
  const theme = board.theme;
  return (
    <Island
      padding={1}
      className={classNames('theme-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <select
        onChange={(e) => {
          const value = (e.target as HTMLSelectElement).value;
          BoardTransforms.updateThemeColor(board, value as ThemeColorMode);
        }}
        value={theme.themeColorMode}
      >
        <option value="default">Default</option>
        <option value="colorful">Colorful</option>
        <option value="soft">Soft</option>
        <option value="retro">Retro</option>
        <option value="dark">Dark</option>
        <option value="starry">Starry</option>
      </select>
    </Island>
  );
};
