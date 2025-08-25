import { useBoard } from '@plait-board/react-board';
import Stack from '../stack';
import { ToolButton } from '../tool-button';
import { ZoomInIcon, ZoomOutIcon } from '../icons';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  PlaitBoard,
} from '@plait/core';
import { Island } from '../island';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';
import { useState } from 'react';
import Menu from '../menu/menu';
import MenuItem from '../menu/menu-item';

export const ZoomToolbar = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  return (
    <Island
      padding={1}
      className={classNames('zoom-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row gap={1}>
        <ToolButton
          key={0}
          type="button"
          icon={ZoomOutIcon}
          visible={true}
          title={`Zoom Out — Cmd+-`}
          aria-label={`Zoom Out — Cmd+-`}
          onPointerUp={() => {
            BoardTransforms.updateZoom(board, board.viewport.zoom - 0.1);
          }}
          className="zoom-out-button"
        />
        <Popover
          sideOffset={12}
          open={zoomMenuOpen}
          onOpenChange={(open) => {
            setZoomMenuOpen(open);
          }}
          placement="bottom-end"
        >
          <PopoverTrigger asChild>
            <div
              key={1}
              title={`Fit to Screen`}
              aria-label={`Fit to Screen`}
              className={classNames('zoom-menu-trigger', {
                active: zoomMenuOpen,
              })}
              onPointerUp={() => {
                setZoomMenuOpen(!zoomMenuOpen);
              }}
            >
              {Number(((board?.viewport?.zoom || 1) * 100).toFixed(0))}%
            </div>
          </PopoverTrigger>
          <PopoverContent container={container}>
            <Menu
              onSelect={() => {
                setZoomMenuOpen(false);
              }}
            >
              <MenuItem
                data-testid="open-button"
                onSelect={() => {
                  BoardTransforms.fitViewport(board);
                }}
                aria-label={`${`Fit to Screen`}`}
                shortcut={`Cmd+Shift+=`}
              >{`Fit to Screen`}</MenuItem>
              <MenuItem
                data-testid="open-button"
                onSelect={() => {
                  BoardTransforms.updateZoom(board, 1);
                }}
                aria-label={`${`Zoom to 100%`}`}
                shortcut={`Cmd+0`}
              >{`Zoom to 100%`}</MenuItem>
            </Menu>
          </PopoverContent>
        </Popover>
        <ToolButton
          key={2}
          type="button"
          icon={ZoomInIcon}
          visible={true}
          title={`Zoom In — Cmd++`}
          aria-label={`Zoom In — Cmd++`}
          onPointerUp={() => {
            BoardTransforms.updateZoom(board, board.viewport.zoom + 0.1);
          }}
          className="zoom-in-button"
        />
      </Stack.Row>
    </Island>
  );
};
