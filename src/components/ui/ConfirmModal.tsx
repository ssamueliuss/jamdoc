import React from 'react';

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  variant?: 'error' | 'info' | 'success';
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, variant = 'info', onClose, onConfirm, confirmLabel, cancelLabel }) => {
  if (!isOpen) return null;
  const colorClasses = variant === 'error'
    ? 'bg-red-100 text-red-700'
    : variant === 'success'
    ? 'bg-green-100 text-green-700'
    : 'bg-indigo-100 text-indigo-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="p-4 border-b border-gray-100 flex items-start gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-md font-bold ${colorClasses}`}>{variant === 'error' ? '!' : 'i'}</div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{title || (variant === 'error' ? 'Error' : 'Información')}</div>
            <div className="text-sm text-gray-600 mt-1">{message}</div>
          </div>
        </div>

        <div className="p-4 flex justify-end gap-2">
          {onConfirm ? (
            <>
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">{cancelLabel || 'Cancelar'}</button>
              <button onClick={() => { onConfirm && onConfirm(); onClose(); }} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">{confirmLabel || 'Aceptar'}</button>
            </>
          ) : (
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">Cerrar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
