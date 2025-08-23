import { formulaSchema } from "~/schemas";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { evaluate } from "mathjs";
import { formatNumber } from "~/lib/utils";
import { Button } from "./ui/button";
import { InfoIcon, Minus, Plus } from "lucide-react";
import { FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface FormulaColumnFieldsProps {
  result: string;
  isLoading: boolean;
}

export default function FormulaColumnFields({
  result,
  isLoading,
}: FormulaColumnFieldsProps) {
  const form = useFormContext<z.infer<typeof formulaSchema>>();

  const variables = form
    .watch("variables")
    .reduce<Record<string, number>>((acc, item) => {
      acc[item.name] = Number(item.value);

      return acc;
    }, {});

  const addNewColumn = () => {
    const columns = form.getValues("columns");
    columns.push({
      header: "",
      value: "",
    });

    form.setValue("columns", columns);
  };

  const removeColumn = (id: number) => {
    const columns = form.getValues("columns");
    delete columns[id];

    form.setValue("columns", columns);
  };

  return (
    <div className="space-y-4">
      <span>
        <h3 className="font-bold text-xl">Formula Data Table</h3>
        <p className="text-muted-foreground text-sm">
          Displays information on invoice on how the formula is computed
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="">
            <h4 className="font-bold text-lg">Table Preview</h4>
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    {form.watch("columns").map((column, index) => (
                      <TableHead key={index}>{column.header}</TableHead>
                    ))}
                    <TableHead>Amount Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {form.watch("columns").map((column, index) => {
                      try {
                        const result = evaluate(column.value, variables);

                        return (
                          <TableCell key={index}>
                            {formatNumber(result)}
                          </TableCell>
                        );
                      } catch (error) {
                        // console.log(error);
                        return (
                          <TableCell key={index}>
                            <span className="font-semibold text-red-200">
                              Error
                            </span>
                          </TableCell>
                        );
                      }
                    })}
                    <TableCell>{formatNumber(Number(result))}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg">Table Columns</h4>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="w-8 h-8"
                onClick={addNewColumn}
                disabled={isLoading}
              >
                <Plus />
              </Button>
            </div>
            <Alert>
              <InfoIcon />
              <AlertDescription>
                You can use mathematical expressions in the "Value" field. For
                example, enter `a + b * 2` to calculate using variables defined
                above. Supported operators: +, -, *, /, ^, parentheses, min,
                max, and variables.
              </AlertDescription>
            </Alert>
            <Table>
              <TableBody>
                {form.watch("columns").map((column, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="pt-5">
                          <Button
                            size="icon"
                            className="w-6 h-6"
                            variant="outline"
                            type="button"
                            disabled={column.isStatic || isLoading}
                            onClick={() => removeColumn(index)}
                          >
                            <Minus />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`columns.${index}.header`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Header</FormLabel>
                              <Input
                                disabled={column.isStatic || isLoading}
                                {...form.register(`columns.${index}.header`)}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`columns.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="grow">
                              <FormLabel>Value</FormLabel>
                              <Input
                                disabled={column.isStatic || isLoading}
                                {...form.register(`columns.${index}.value`)}
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </span>
    </div>
  );
}
