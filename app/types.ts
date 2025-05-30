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

export type Meter = {
  id?: number;
  subscriber_id?: number | undefined;
  number: number;
  note?: string;
  created_at?: string;
};
