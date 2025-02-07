import axios from "axios";
import axiosInstance from "./axios.instances";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  status?: "active" | "inactive";
}

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await axiosInstance.get(`${API_URL}/customers`);
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await axiosInstance.get(`${API_URL}/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer: CreateCustomerDto): Promise<Customer> {
    const response = await axiosInstance.post(`${API_URL}/customers`, customer);
    return response.data;
  },

  async updateCustomer(
    id: string,
    customer: UpdateCustomerDto
  ): Promise<Customer> {
    const response = await axiosInstance.put(
      `${API_URL}/customers/${id}`,
      customer
    );
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await axiosInstance.delete(`${API_URL}/customers/${id}`);
  },

  async getCustomerOrders(id: string): Promise<any[]> {
    const response = await axiosInstance.get(
      `${API_URL}/customers/${id}/orders`
    );
    return response.data;
  },
};
