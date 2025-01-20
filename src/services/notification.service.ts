import axios from 'axios';

const API_URL = 'https://jnex-app-9e582fd43636.herokuapp.com';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    relatedTo?: {
        type: 'customer' | 'order' | 'product' | 'task';
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const notificationService = {
    async getNotifications(): Promise<Notification[]> {
        const response = await axios.get(`${API_URL}/notifications`);
        return response.data;
    },

    async markAsRead(id: string): Promise<void> {
        await axios.put(`${API_URL}/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await axios.put(`${API_URL}/notifications/read-all`);
    },

    async deleteNotification(id: string): Promise<void> {
        await axios.delete(`${API_URL}/notifications/${id}`);
    },

    async clearAllNotifications(): Promise<void> {
        await axios.delete(`${API_URL}/notifications/clear-all`);
    },
}; 