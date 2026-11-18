import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications((prev) => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
    
    return id;
  }, []);

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback((message, duration = 3000) => {
    return show(message, 'success', duration);
  }, [show]);

  const error = useCallback((message, duration = 4000) => {
    return show(message, 'error', duration);
  }, [show]);

  const warning = useCallback((message, duration = 3500) => {
    return show(message, 'warning', duration);
  }, [show]);

  const info = useCallback((message, duration = 3000) => {
    return show(message, 'info', duration);
  }, [show]);

  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info,
  };
};

export default useNotification;
