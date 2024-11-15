import React, { FC, PropsWithChildren } from "react";
import ReactDOM from "react-dom";

const ModalWrapper: FC<PropsWithChildren & { isOpen: boolean; onClose: () => void }> = ({
  children,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={(evt) => {
        evt.stopPropagation();
        onClose();
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default ModalWrapper;
