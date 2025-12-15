const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="confirm-dialog">
          <h2 className="modal-title">{title}</h2>
          <p className="confirm-message">{message}</p>
          <div className="confirm-actions">
            <button onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={onConfirm} className="btn btn-danger">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
