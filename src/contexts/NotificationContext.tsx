import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import socket from '../socket';
import { useAuth } from './AuthContext';

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  notificationCount: number;
  clearNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notificationCount: 0,
  clearNotifications: async () => {}
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  // ✅ Real-time update using socket.io
  useEffect(() => {
    socket.on('notification', () => {
      fetchNotifications();
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const clearNotifications = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(
        unread.map(n => axios.put(`/notifications/${n._id}/read`))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const value: NotificationContextType = {
    notifications,
    notificationCount: notifications.filter(n => !n.read).length,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
