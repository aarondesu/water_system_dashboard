import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { formulaSchema } from "~/schemas";
import FormulaColumnFields from "../formula-column-fields";
import FormulaVariablesFields from "../formula-variables-fields";

export default function CreateFormulaForm() {
  const form = useForm<z.infer<typeof formulaSchema>>({
    resolver: zodResolver(formulaSchema),
    defaultValues: {
      name: "",
      description: "",
      variables: [
        {
          name: "consumption",
          description: "This is automatically added during computation.",
          value: 10,
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
    },
  });

  const [testSuccessful, setTestSuccessful] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [consumption, setConsumtion] = useState<number>();

  const variables = form
    .watch("variables")
    .reduce<Record<string, number>>((acc, item) => {
      acc[item.name] = Number(item.value);

      return acc;
    }, {});

  const onSubmit = form.handleSubmit((data) => {
    // Remove consumption variable
    data.variables = data.variables.filter((v) => v.name !== "consumption");

    console.log(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormulaVariablesFields
          result={result}
          onEvaluate={(success, result) => {
            setResult((res) => (res = result));
            setTestSuccessful((testSuccessful) => (testSuccessful = success));
          }}
        />
        <FormulaColumnFields result={result} />
        <div className="grid w-full md:w-fit">
          <Button type="submit" disabled={!testSuccessful} className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
