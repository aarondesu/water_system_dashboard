import { z } from "zod";

const formulaVariable = z.object({
  name: z.string(),
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

export const formulaSchema = z
  .object({
    name: z.string(),
    expression: z.string(),
    description: z.string(),
    variables: z.array(formulaVariable),
    columns: z.array(formulaTableColumn),
  })
  .superRefine((data, ctx) => {
    const names = data.variables.map((variable) => variable.name);
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Names must be unique from each other to avoid conflict`,
        path: ["variables"],
      });
    }
  });
