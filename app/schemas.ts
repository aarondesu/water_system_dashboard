import { z } from "zod";

const formulaVariable = z.object({
  name: z
    .string()
    .min(1, { message: "Variable name must be longer than 1 character" }),
  description: z.string().optional(),
  value: z.coerce.number(),
  unit: z.string(),
  isStatic: z.boolean().default(false).optional(),
});

export const formulaTableColumn = z.object({
  header: z.string(),
  value: z.string(),
  isStatic: z.boolean().default(false).optional(),
});

export const formulaSchema = z.object({
  name: z.string(),
  expression: z.string(),
  description: z.string(),
  variables: z.array(formulaVariable),
  columns: z.array(formulaTableColumn),
});

export const invoiceSchema = z.object({
  subscriber_id: z.coerce.number(),
  meter_id: z.coerce.number(),
  previous_reading_id: z.number().or(z.undefined()),
  current_reading_id: z.number().min(1, "Current Reading is required"),
  rate_per_unit: z.coerce.number().min(1, "Rate Per unit is required"),
  due_date: z.date(),
});

export const meterSchema = z.object({
  subscriber_id: z.number().optional(),
  number: z.coerce.number().min(1, "Meter number must be greater than 1"),
  note: z.string(),
  status: z.enum(["active", "inactive"]),
});

export const readingSchema = z.object({
  meter_id: z.number().min(1, { message: "Select meter for reading" }),
  reading: z.coerce
    .number()
    .min(1, { message: "Current meter reading is required" }),
  start_date: z.coerce.date({
    message: "Start and End date are required",
  }),
  end_date: z.coerce.date({
    message: "Start and End date are required",
  }),
  note: z.string().optional().or(z.literal("")),
});

export const subscriberSchema = z.object({
  first_name: z.string().nonempty({ message: "First Name must not be empty" }),
  last_name: z.string().nonempty({ message: "Last Name must not be empty" }),
  mobile_number: z
    .string()
    .nonempty({ message: "Mobile number must not be empty" }),
  address: z.string().nonempty({ message: "First Name must not be empty" }),
  email: z.string().email().optional().or(z.literal("")),
});

export const userSchema = z
  .object({
    // Account Details
    username: z.string().nonempty({ message: "Username is required" }),
    password: z.string().nonempty({ message: "Password is required" }),
    confirm_password: z
      .string()
      .nonempty({ message: "Confirm Password is required" }),
    // Personal Details
    first_name: z.string(),
    last_name: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match.",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z.string({ required_error: "Password is required" }),
});
