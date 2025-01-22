// AUTH
export interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
}

// COMMON TABLE
interface Column {
  key: string;
  header: string;
}

export interface TableProps {
  columns: Column[];
  data: any[];
}

// COMMON SELECT
export interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// USER
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// LEAD
interface LeadCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface LeadStaff {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

export interface Interaction {
  type: string;
  notes: string;
  timestamp: Date;
  user: string;
  oldStatus?: string;
  newStatus?: string;
  taskId?: number;
  title?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  lead_id?: number;
  staff_user?: number;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  task_type: 'follow_up' | 'meeting' | 'call' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  user?: {
    id: number;
    name: string;
  };
  lead?: {
    lead_no: string;
    status: string;
    score: number;
  };
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  customerId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: number;
    code: string;
    name: string;
    description: string;
    price: number;
  };
}
