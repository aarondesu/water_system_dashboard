import { z } from "zod";
import { formulaSchema } from "~/schemas";
import { useFormContext } from "react-hook-form";
import { evaluate } from "mathjs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ChevronsUpDown, InfoIcon, Minus, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { formatNumber } from "~/lib/utils";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useCallback } from "react";

interface FormulaVariablesFieldsProps {
  result: string;
  onEvaluate: (success: boolean, result: string) => void;
  isLoading: boolean;
}

export default function FormulaVariablesFields({
  onEvaluate,
  isLoading,
  result,
}: FormulaVariablesFieldsProps) {
  const form = useFormContext<z.infer<typeof formulaSchema>>();

  const variables = form
    .watch("variables")
    .reduce<Record<string, number>>((acc, item) => {
      acc[item.name] = Number(item.value);

      return acc;
    }, {});

  const addNewVariable = useCallback(() => {
    const variables = form.getValues("variables");
    variables.push({
      name: "",
      value: 0,
      unit: "",
      description: "",
    });

    form.setValue("variables", variables);
  }, [form]);

  const removeVariable = useCallback(
    (id: number) => {
      const variables = form.getValues("variables");
      delete variables[id];

      form.setValue("variables", variables);
    },
    [form]
  );

  const evaluateExpression = useCallback(() => {
    try {
      form.clearErrors("expression");
      const result = evaluate(form.getValues("expression") ?? "", variables);

      onEvaluate(true, result);
    } catch (error) {
      form.setError("expression", {
        message: String(error),
        type: "pattern",
      });
      onEvaluate(false, String(error));
    }
  }, [form, onEvaluate, variables]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h3 className="font-bold text-xl">Formula Details</h3>
        <FormField
          {...form}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder="Give a description for the fromula"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expression"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expression</FormLabel>
              {/* <AnimatePresence>
                    {!testSuccessful && (
                      <motion.div exit={{ height: 0 }} transition={{}}>
                        <Alert variant="destructive">
                          <TriangleAlert />
                          <AlertTitle>Head's Up!</AlertTitle>
                          <AlertDescription>
                            Before submitting, you are required to test the
                            expression.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence> */}
              <Alert>
                <InfoIcon />
                <AlertDescription>
                  Define your formula clearly. Start by identifying the
                  variables you will use (e.g., price, quantity, taxRate,
                  discount). Then, combine these variables into a mathematical
                  equation that calculates the total amount to be paid. For
                  example: (price * quantity) * (1 + taxRate) - discount. Make
                  sure the formula follows the correct order of operations so
                  the result is accurate. Supported operators: +, -, *, /, ^,
                  parentheses, min, max, and variables.
                </AlertDescription>
              </Alert>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isLoading}
                  placeholder="eg. (consumption * rate_per_unit)"
                />
              </FormControl>
              <FormMessage />

              <span className="flex gap-1">
                <Input
                  disabled={true}
                  value={formatNumber(Number(result))}
                  placeholder="Results"
                />

                <Button
                  type="button"
                  variant="outline"
                  className=""
                  onClick={evaluateExpression}
                  disabled={form.watch("expression").length === 0 || isLoading}
                >
                  Test
                </Button>
              </span>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <h3 className="font-bold text-xl">Formula Variables</h3>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="w-8 h-8"
            onClick={addNewVariable}
          >
            <Plus />
          </Button>
        </div>
        <Alert>
          <InfoIcon />
          <AlertDescription>
            <p>
              Variables are names used to represent fixed values in a formula.
              eg: rate = 80. The only exception here will be the consumption.
              This variable is automatically assigned during the computation
              process.
            </p>
          </AlertDescription>
        </Alert>
        <FormField
          control={form.control}
          name="variables"
          render={() => (
            <FormItem>
              <FormMessage className="p-3 border border-red-100 rounded-md" />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Table>
            <TableBody>
              {form.watch("variables").map((variable, index) => (
                <TableRow key={index}>
                  <TableCell className="flex gap-4 py-4">
                    <div className="">
                      <Button
                        type="button"
                        size="icon"
                        className="w-6 h-6"
                        variant="outline"
                        disabled={variable.isStatic || isLoading}
                        onClick={() => removeVariable(index)}
                      >
                        <Minus />
                      </Button>
                    </div>
                    <div className="grow space-y-2">
                      <Collapsible defaultOpen={variable.isStatic}>
                        <div className="flex items-end gap-2">
                          <div className="grow grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`variables.${index}.name`}
                              render={() => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={variable.isStatic || isLoading}
                                      {...form.register(
                                        `variables.${index}.name`
                                      )}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variables.${index}.value`}
                              render={({}) => (
                                <FormItem>
                                  <FormLabel>Value</FormLabel>
                                  <Input
                                    {...form.register(
                                      `variables.${index}.value`
                                    )}
                                    disabled={isLoading}
                                    type="number"
                                    step="any"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" type="button" variant="ghost">
                              <ChevronsUpDown />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <div className="space-y-4 mt-4">
                            <FormField
                              control={form.control}
                              name="variables"
                              render={({}) => (
                                <FormItem>
                                  <FormLabel>Unit</FormLabel>
                                  <Input
                                    disabled={variable.isStatic || isLoading}
                                    {...form.register(
                                      `variables.${index}.unit`
                                    )}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="variables"
                              render={({}) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      disabled={variable.isStatic || isLoading}
                                      {...form.register(
                                        `variables.${index}.description`
                                      )}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
