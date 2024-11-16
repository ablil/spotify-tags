import React, { FC, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import { isMobileDevice } from "../tracks/SpotifyTrack";

const ModalWrapper: FC<PropsWithChildren & { isOpen: boolean; onClose: () => void }> = ({
  children,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      data-mobile={isMobileDevice()}
      onClick={(evt) => {
        evt.stopPropagation();
        onClose();
      }}
    >
      <div className="modal-content" data-mobile={isMobileDevice()} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default ModalWrapper;
