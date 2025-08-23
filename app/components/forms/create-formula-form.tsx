import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { formulaSchema } from "~/schemas";
import FormulaColumnFields from "../formula-column-fields";
import FormulaVariablesFields from "../formula-variables-fields";
import { useCreateFormulaMutation } from "~/redux/apis/formulaApi";
import { toast } from "sonner";

export default function CreateFormulaForm() {
  const initialValues: z.infer<typeof formulaSchema> = {
    name: "",
    description: "",
    variables: [
      {
        name: "consumption",
        description: "This is automatically added during computation.",
        value: 10,
        unit: "",
        isStatic: true,
      },
    ],
    columns: [
      {
        header: "Consumption",
        value: "consumption",
        isStatic: true,
      },
    ],
    expression: "",
  };

  const form = useForm<z.infer<typeof formulaSchema>>({
    resolver: zodResolver(formulaSchema),
    defaultValues: initialValues,
  });

  const [testSuccessful, setTestSuccessful] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [consumption, setConsumtion] = useState<number>();
  const [createFormula, { isLoading }] = useCreateFormulaMutation();

  const onSubmit = form.handleSubmit((data) => {
    // Remove consumption variable
    data.variables = data.variables.filter((v) => v.name !== "consumption");

    toast.promise(createFormula(data).unwrap(), {
      success: () => {
        form.reset(initialValues);

        return "Successfully created the formula!";
      },
      error: (error) => {
        return "Failed to create formula";
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-2 border rounded-md bg-green-50">
          {Object.entries(form.formState.errors).map(([type, message]) => (
            <p key={type}>{message.message}</p>
          ))}
        </div>
        <FormulaVariablesFields
          isLoading={isLoading}
          result={result}
          onEvaluate={(success, result) => {
            setResult((res) => (res = result));
            setTestSuccessful((testSuccessful) => (testSuccessful = success));
          }}
        />
        <FormulaColumnFields isLoading={isLoading} result={result} />
        <div className="grid w-full md:w-fit">
          <Button
            type="submit"
            disabled={!testSuccessful || isLoading}
            className="w-full"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
