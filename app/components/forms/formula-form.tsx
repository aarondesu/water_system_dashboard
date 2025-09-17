import { z } from "zod";
import { Form } from "../ui/form";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { formulaSchema } from "~/schemas";
import FormulaColumnFields from "../formula-column-fields";
import FormulaVariablesFields from "../formula-variables-fields";
import {
  useCreateFormulaMutation,
  useUpdateFormulaMutation,
} from "~/redux/apis/formulaApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type {
  ApiError,
  Formula,
  FormulaTableColumn,
  FormulaVariable,
} from "~/types";
import { useConfirmationDialog } from "../confirmation-dialog-provider";
import { useNavigate } from "react-router";

interface CreateFormulaForm {
  data?: Formula & {
    variables: FormulaVariable[];
    columns: FormulaTableColumn[];
  };
  mode?: "create" | "edit";
}

export default function FormulaForm({
  data,
  mode = "create",
}: CreateFormulaForm) {
  const { createDialog } = useConfirmationDialog();
  const navigate = useNavigate();

  const initialValues = useMemo<z.infer<typeof formulaSchema>>(
    () => ({
      name: data?.name ?? "",
      description: data?.description ?? "",
      variables: [
        {
          name: "consumption",
          description: "This is automatically added during computation.",
          value: 10,
          unit: "",
          isStatic: true,
        },
        ...(data?.variables ?? []),
      ],
      columns: data?.columns ?? [
        {
          header: "Consumption",
          value: "consumption",
          isStatic: true,
        },
      ],
      expression: data?.expression ?? "",
    }),
    [data]
  );

  const form = useForm<z.infer<typeof formulaSchema>>({
    resolver: zodResolver(formulaSchema),
    defaultValues: initialValues,
  });

  const [testSuccessful, setTestSuccessful] = useState<boolean>(
    mode === "edit" ? true : false
  );
  const [result, setResult] = useState<string>("");
  const [createFormula, createFormulaResults] = useCreateFormulaMutation();
  const [updateFormula, updateFormulaResults] = useUpdateFormulaMutation();

  const onSubmit = form.handleSubmit((d) => {
    // Remove consumption variable
    d.variables = d.variables.filter((v) => v.name !== "consumption");

    if (d.variables.length === 0) {
      form.setError("variables", {
        message: "Variables need to be added other than the consumption",
      });
    } else {
      createDialog({
        title: `${String(mode).charAt(0).toUpperCase() + String(mode).slice(1)} Formula`,
        description: `Are you sure you want to proceed? Make sure all details are correct before submitting. Formula details can be edited after creation.`,
        action: () => {
          // Check mode
          if (mode === "create") {
            toast.promise(createFormula(d).unwrap(), {
              success: () => {
                form.reset(initialValues);

                return "Successfully created the formula!";
              },
              error: (error) => {
                for (const [item, errors] of Object.entries(
                  (error as ApiError).data.errors
                )) {
                  const field = item as FieldPath<
                    z.infer<typeof formulaSchema>
                  >;

                  errors.forEach((err) => {
                    form.setError(field, {
                      type: "value",
                      message: err,
                    });
                  });
                }

                return "Failed to create formula";
              },
            });
          } else {
            // TODO: Add update logic
            const finalData = {
              ...d,
              id: data?.id ?? 0,
            };

            toast.promise(
              updateFormula({
                id: data?.id ?? 0,
                formula: d,
              }).unwrap(),
              {
                loading: "Updating formula...",
                success: () => {
                  form.reset(initialValues);
                  navigate("/dashboard/formula");

                  return "Successfully updated formula!";
                },
                error: (err) => {
                  console.log(err);
                  return "Error";
                },
              }
            );
          }
        },
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {Object.values(form.formState.errors).map((error, index) => (
          <div key={index}>{error.message}</div>
        ))}
        <FormulaVariablesFields
          mode={mode}
          onVariablesChange={() =>
            setTestSuccessful((success) => (success = false))
          }
          isLoading={
            createFormulaResults.isLoading || updateFormulaResults.isLoading
          }
          result={result}
          onEvaluate={(success, result) => {
            setResult((res) => (res = result));
            setTestSuccessful((testSuccessful) => (testSuccessful = success));
          }}
        />
        <FormulaColumnFields
          mode={mode}
          isLoading={
            createFormulaResults.isLoading || updateFormulaResults.isLoading
          }
          result={result}
        />
        <div className="grid w-full md:w-fit">
          <Button
            type="submit"
            disabled={
              !testSuccessful ||
              createFormulaResults.isLoading ||
              updateFormulaResults.isLoading
            }
            className="w-full"
          >
            {(createFormulaResults.isLoading ||
              updateFormulaResults.isLoading) && (
              <Loader2 className="animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
