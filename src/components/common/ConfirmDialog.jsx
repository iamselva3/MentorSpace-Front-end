import React from 'react';
import { FiAlertTriangle, FiX, FiCheck, FiInfo, FiHelpCircle } from 'react-icons/fi';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', 
  size = 'md', 
  children 
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: FiAlertTriangle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
      borderColor: 'border-yellow-200'
    },
    danger: {
      icon: FiAlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      borderColor: 'border-red-200'
    },
    info: {
      icon: FiInfo,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      confirmColor: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-200'
    },
    success: {
      icon: FiCheck,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      confirmColor: 'bg-green-600 hover:bg-green-700',
      borderColor: 'border-green-200'
    },
    question: {
      icon: FiHelpCircle,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      confirmColor: 'bg-purple-600 hover:bg-purple-700',
      borderColor: 'border-purple-200'
    }
  };

  const sizeConfig = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl'
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  // Handle escape key press
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div 
        className={`
          ${sizeConfig[size]} 
          w-full bg-white rounded-xl shadow-2xl 
          transform transition-all animate-fadeIn
          border ${config.borderColor}
        `}
      >
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.bgColor}`}>
              <Icon className={`text-xl ${config.iconColor}`} />
            </div>
            <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <p id="dialog-description" className="text-gray-600 leading-relaxed">
            {message}
          </p>

          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              transition-colors ${config.confirmColor}
              focus:ring-${type === 'danger' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500
            `}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmDialog = ({ isOpen, onConfirm, onCancel, itemName = 'item' }) => (
  <ConfirmDialog
    isOpen={isOpen}
    title="Delete Confirmation"
    message={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText="Delete"
    cancelText="Cancel"
    type="danger"
  />
);

export const WarningConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => (
  <ConfirmDialog
    isOpen={isOpen}
    title={title || "Warning"}
    message={message}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText="Yes, Proceed"
    cancelText="No, Cancel"
    type="warning"
  />
);

export const InfoDialog = ({ isOpen, title, message, onConfirm, onCancel }) => (
  <ConfirmDialog
    isOpen={isOpen}
    title={title || "Information"}
    message={message}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText="Got it"
    cancelText="Close"
    type="info"
  />
);

export const SuccessDialog = ({ isOpen, title, message, onConfirm }) => (
  <ConfirmDialog
    isOpen={isOpen}
    title={title || "Success"}
    message={message}
    onConfirm={onConfirm}
    onCancel={onConfirm}
    confirmText="Continue"
    cancelText="Close"
    type="success"
  />
);

export const QuestionDialog = ({ isOpen, title, message, onConfirm, onCancel }) => (
  <ConfirmDialog
    isOpen={isOpen}
    title={title || "Confirm Action"}
    message={message}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText="Yes"
    cancelText="No"
    type="question"
  />
);

export default ConfirmDialog;