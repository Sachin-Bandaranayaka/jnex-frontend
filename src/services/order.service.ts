import axios from 'axios';

const API_URL = 'https://jnex-app-9e582fd43636.herokuapp.com';

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    productName: string;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderDto {
    customerId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}

export interface UpdateOrderDto {
    status?: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentStatus?: 'pending' | 'paid' | 'failed';
}

export const orderService = {
    async getOrders(): Promise<Order[]> {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
    },

    async getOrder(id: string): Promise<Order> {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        return response.data;
    },

    async createOrder(order: CreateOrderDto): Promise<Order> {
        const response = await axios.post(`${API_URL}/orders`, order);
        return response.data;
    },

    async updateOrder(id: string, order: UpdateOrderDto): Promise<Order> {
        const response = await axios.put(`${API_URL}/orders/${id}`, order);
        return response.data;
    },

    async deleteOrder(id: string): Promise<void> {
        await axios.delete(`${API_URL}/orders/${id}`);
    },
}; 