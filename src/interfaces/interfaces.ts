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
  leadId: number;
  assignedTo: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  taskType: 'follow_up' | 'meeting' | 'call' | 'other';
  completedAt?: Date;
  assignee?: LeadStaff;
}

export interface Lead {
  id: number;
  leadNo: number;
  cusPhone: string;
  other: string;
  productCode: string;
  staffUser: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  notes?: string;
  interactionHistory: Interaction[];
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer: LeadCustomer;
  staff: LeadStaff;
  tasks?: Task[];
}
