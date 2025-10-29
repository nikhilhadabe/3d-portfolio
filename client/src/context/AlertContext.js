import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const alert = { id, message, type, duration };
    
    setAlerts(prev => [...prev, alert]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeAlert(id);
    }, duration);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const success = (message, duration) => showAlert(message, 'success', duration);
  const error = (message, duration) => showAlert(message, 'error', duration);
  const warning = (message, duration) => showAlert(message, 'warning', duration);
  const info = (message, duration) => showAlert(message, 'info', duration);

  const value = {
    alerts,
    showAlert,
    success,
    error,
    warning,
    info,
    removeAlert
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};

// Alert Container Component
const AlertContainer = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {alerts.map(alert => (
        <AlertBox
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

// Individual Alert Box Component
const AlertBox = ({ message, type, onClose }) => {
  const getAlertStyles = () => {
    const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between animate-fade-in";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  return (
    <div className={getAlertStyles()}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">{getIcon()}</span>
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        ✕
      </button>
    </div>
  );
};

export default AlertContext;