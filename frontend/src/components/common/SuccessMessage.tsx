import React from 'react';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onClose }) => {
  return (
    <div className="success-message">
      <div className="success-content">
        <span className="success-icon">✅</span>
        <span className="success-text">{message}</span>
        <button className="success-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
