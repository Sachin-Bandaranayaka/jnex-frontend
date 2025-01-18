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
  lead_id: number;
  staff_user: number;
  title: string;
  description?: string;
  due_date: Date;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  task_type: "follow_up" | "meeting" | "call" | "other";
  created_at?: Date;
  updated_at?: Date;
  user?: {
    id: number;
    username: string;
    name: string;
  };
  lead?: {
    lead_no: string;
    status: string;
    score: number;
  };
}

export interface Lead {
  id: number;
  lead_no: number;
  cus_phone: string;
  other: string;
  product_code: string;
  staffUser: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  score: number;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  notes?: string;
  interactionHistory?: Interaction[];
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  customer: LeadCustomer;
  staff: LeadStaff;
  tasks?: Task[];
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

export interface Order {
  id: number;
  orderNo: string;
  customerId: number;
  customer: LeadCustomer;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  paymentStatus: "unpaid" | "partially_paid" | "paid" | "refunded";
  paymentMethod?: string;
  shippingAddress: string;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
