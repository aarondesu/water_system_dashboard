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
