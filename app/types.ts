export type LoginDetails = {
  username: string;
  password: string;
};

export type Subscriber = {
  id?: number;
  first_name: string;
  last_name: string;
  address: string;
  mobile_number: string;
  email?: string;
  created_at?: string;
};

export type User = {
  id?: number;
  username: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
};

export type Reading = {
  id?: number;
  meter_id: number;
  reading: number;
  note?: string;
  start_date: Date;
  end_date: Date;
  created_at?: string;
};

export type Meter = {
  id?: number;
  subscriber_id?: number | undefined;
  number: number;
  status: "active" | "inactive";
  note?: string;
  created_at?: string;
  readings?: Reading[];
};

export type Invoice = {
  id?: number;
  subscriber_id: number;
  meter_id: number;
  previous_reading_id: number;
  current_reading_id: number;
  consumption?: number;
  rate_per_unit: number;
  amount_due?: number;
  status: "unpaid" | "partial" | "paid";
  due_date: string;
  created_at: string;
  updated_at: string;
};

export type ApiError = {
  status: number;
  data: {
    success: boolean;
    errors: string[][];
  };
};

export type PaginationArgs = {
  page_index: number;
  rows: number;
  search?: string;
};

export type PaginationResults<T> = {
  pages: number;
  items: T[];
};
