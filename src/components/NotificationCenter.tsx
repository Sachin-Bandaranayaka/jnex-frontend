import { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { api } from '@/lib/api';

interface Notification {
    id: string;
    type: 'lead' | 'task' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: {
        leadId?: number;
        taskId?: number;
        status?: string;
        score?: number;
    };
}

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
        setupNotificationListener();
    }, []);

    const fetchNotifications = async () => {
        try {
            setError(null);
            const response = await api.get('/notifications');

            if (response.data?.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.notifications.filter((n: Notification) => !n.isRead).length);
            } else {
                setError('Failed to fetch notifications');
            }
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            setError('Failed to fetch notifications. Please try again.');
        }
    };

    const setupNotificationListener = () => {
        // Here you would set up WebSocket or Server-Sent Events for real-time notifications
        // For now, we'll just poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    };

    const markAsRead = async (notificationId: string) => {
        try {
            setError(null);
            const response = await api.post(`/notifications/${notificationId}/read`);

            if (response.data?.success) {
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error: any) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setError(null);
            const response = await api.post('/notifications/mark-all-read');

            if (response.data?.success) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (error: any) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            setError(null);
            const response = await api.delete(`/notifications/${notificationId}`);

            if (response.data?.success) {
                setNotifications(prev =>
                    prev.filter(n => n.id !== notificationId)
                );
                if (!notifications.find(n => n.id === notificationId)?.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error: any) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'lead':
                return <FaExclamationTriangle className="text-yellow-500" />;
            case 'task':
                return <FaCheck className="text-green-500" />;
            default:
                return <FaBell className="text-blue-500" />;
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FaCheck size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="ml-2 text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTimes size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 