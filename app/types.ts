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

export type ApiError = {
  status: number;
  data: {
    success: boolean;
    errors: string[][];
  };
};
