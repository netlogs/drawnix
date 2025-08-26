import { useState, useEffect, useDeferredValue } from 'react';
import './mermaid-to-drawnix.scss';
import './ttd-dialog.scss';
import { TTDDialogPanels } from './ttd-dialog-panels';
import { TTDDialogPanel } from './ttd-dialog-panel';
import { TTDDialogInput } from './ttd-dialog-input';
import { TTDDialogOutput } from './ttd-dialog-output';
import { TTDDialogSubmitShortcut } from './ttd-dialog-submit-shortcut';
import { useDrawnix } from '../../hooks/use-drawnix';
import { useBoard } from '@plait-board/react-board';
import {
  getViewportOrigination,
  PlaitBoard,
  PlaitElement,
  WritableClipboardOperationType,
} from '@plait/core';
import { MindElement } from '@plait/mind';

export interface MarkdownToDrawnixLibProps {
  loaded: boolean;
  api: Promise<{
    parseMarkdownToDrawnix: (
      definition: string,
      mainTopic?: string
    ) => MindElement;
  }>;
}

const MARKDOWN_EXAMPLE = `# Getting Started

- Let me see who created this bug 🕵️ ♂️ 🔍
  - 😯 💣
    - Oh, it was me 👈 🎯 💘

- Why can't it run 🚫 ⚙️ ❓
  - Wait, now it works. Why?🎢 ✨
    - 🤯 ⚡ ➡️ 🎉

- If it works 🐞 🚀
  - Don't touch it 🛑 ✋
    - 👾 💥 🏹 🎯
    
## Boy or Girl 👶 ❓ 🤷 ♂️ ♀️

### Hello world 👋 🌍 ✨ 💻

#### Wow, it's a programmer 🤯 ⌨️ 💡 👩 💻`;

const MarkdownToDrawnix = () => {
  const { appState, setAppState } = useDrawnix();
  const [markdownToDrawnixLib, setMarkdownToDrawnixLib] =
    useState<MarkdownToDrawnixLibProps>({
      loaded: false,
      api: Promise.resolve({
        parseMarkdownToDrawnix: (definition: string, mainTopic?: string) =>
          null as any as MindElement,
      }),
    });

  useEffect(() => {
    const loadLib = async () => {
      try {
        const module = await import('@plait-board/markdown-to-drawnix');
        setMarkdownToDrawnixLib({
          loaded: true,
          api: Promise.resolve(module),
        });
      } catch (err) {
        console.error('Failed to load mermaid library:', err);
        setError(new Error('Failed to load Mermaid library'));
      }
    };
    loadLib();
  }, []);
  const [text, setText] = useState(() => MARKDOWN_EXAMPLE);
  const [value, setValue] = useState<PlaitElement[]>(() => []);
  const deferredText = useDeferredValue(text.trim());
  const [error, setError] = useState<Error | null>(null);
  const board = useBoard();

  useEffect(() => {
    const convertMarkdown = async () => {
      try {
        const api = await markdownToDrawnixLib.api;
        let ret;
        try {
          ret = await api.parseMarkdownToDrawnix(deferredText);
        } catch (err: any) {
          ret = await api.parseMarkdownToDrawnix(
            deferredText.replace(/"/g, "'")
          );
        }
        const mind = ret;
        mind.points = [[0, 0]];
        if (mind) {
          setValue([mind]);
          setError(null);
        }
      } catch (err: any) {
        setError(err);
      }
    };
    convertMarkdown();
  }, [deferredText, markdownToDrawnixLib]);

  const insertToBoard = () => {
    if (!value.length) {
      return;
    }
    const boardContainerRect =
      PlaitBoard.getBoardContainer(board).getBoundingClientRect();
    const focusPoint = [
      boardContainerRect.width / 4,
      boardContainerRect.height / 2 - 20,
    ];
    const zoom = board.viewport.zoom;
    const origination = getViewportOrigination(board);
    const focusX = origination![0] + focusPoint[0] / zoom;
    const focusY = origination![1] + focusPoint[1] / zoom;
    const elements = value;
    board.insertFragment(
      {
        elements: JSON.parse(JSON.stringify(elements)),
      },
      [focusX, focusY],
      WritableClipboardOperationType.paste
    );
    setAppState({ ...appState, openDialogType: null });
  };

  return (
    <TTDDialogPanels>
        <TTDDialogPanel label={'Markdown Syntax'}>
          <TTDDialogInput
            input={text}
            placeholder={'Write Markdown text definition here...'}
            onChange={(event) => setText(event.target.value)}
            onKeyboardSubmit={() => {
              // insertToBoard();
            }}
          />
        </TTDDialogPanel>
        <TTDDialogPanel
          label={'Preview'}
          panelAction={{
            action: () => {
              insertToBoard();
            },
            label: 'Insert',
          }}
          renderSubmitShortcut={() => <TTDDialogSubmitShortcut />}
        >
          <TTDDialogOutput
            value={value}
            loaded={markdownToDrawnixLib.loaded}
            error={error}
          />
        </TTDDialogPanel>
      </TTDDialogPanels>
  );
};
export default MarkdownToDrawnix;
