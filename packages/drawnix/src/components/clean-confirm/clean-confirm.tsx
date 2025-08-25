import { Dialog, DialogContent } from '../dialog/dialog';
import { useDrawnix } from '../../hooks/use-drawnix';
import './clean-confirm.scss';
import { useBoard } from '@plait-board/react-board';

export const CleanConfirm = ({
  container,
}: {
  container: HTMLElement | null;
}) => {
  const { appState, setAppState } = useDrawnix();
  const board = useBoard();
  return (
    <Dialog
      open={appState.openCleanConfirm}
      onOpenChange={(open) => {
        setAppState({ ...appState, openCleanConfirm: open });
      }}
    >
      <DialogContent className="clean-confirm" container={container}>
        <h2 className="clean-confirm__title">Clear Canvas</h2>
        <p className="clean-confirm__description">
          This will clear the entire canvas. Do you want to continue?
        </p>
        <div className="clean-confirm__actions">
          <button
            className="clean-confirm__button clean-confirm__button--cancel"
            onClick={() => {
              setAppState({ ...appState, openCleanConfirm: false });
            }}
          >
            Cancel
          </button>
          <button
            className="clean-confirm__button clean-confirm__button--ok"
            autoFocus
            onClick={() => {
              board.deleteFragment(board.children);
              setAppState({ ...appState, openCleanConfirm: false });
            }}
          >
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
