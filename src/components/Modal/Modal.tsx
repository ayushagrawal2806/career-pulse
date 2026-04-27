import ReactModal from "react-modal";
import "./Modal.css";

ReactModal.setAppElement("#root");

interface ReusableConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
}

const Modal = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "primary",
  onConfirm,
  onClose,
}: ReusableConfirmModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={isLoading ? undefined : onClose}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEsc={!isLoading}
      className="confirm-modal"
      overlayClassName="confirm-modal-overlay"
    >
      <h3 className="confirm-modal-title">{title}</h3>

      <p className="confirm-modal-message">{message}</p>

      <div className="confirm-modal-actions">
        <button
          type="button"
          className="confirm-modal-btn confirm-modal-cancel"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`confirm-modal-btn ${
            variant === "danger"
              ? "confirm-modal-danger"
              : "confirm-modal-primary"
          }`}
        >
          {isLoading ? "Please wait..." : confirmText}
        </button>
      </div>
    </ReactModal>
  );
};

export default Modal;
