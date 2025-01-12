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
  role: string;
}

export interface Lead {
  id: number;
  leadNo: number;
  cusPhone: string;
  other: string;
  productCode: string;
  staffUser: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer: LeadCustomer;
  staff: LeadStaff;
}
