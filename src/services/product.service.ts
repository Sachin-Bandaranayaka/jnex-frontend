import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: "active" | "inactive";
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  async createProduct(product: CreateProductDto): Promise<Product> {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  },

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    const response = await axios.put(`${API_URL}/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await axios.delete(`${API_URL}/products/${id}`);
  },
};
