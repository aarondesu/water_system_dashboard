import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Plus,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { evaluate } from "mathjs";
import { AnimatePresence, motion } from "motion/react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const variable = z.object({
  name: z.string(),
  description: z.string().optional(),
  value: z.coerce.number(),
  unit: z.string(),
});

const formSchema = z.object({
  name: z.string(),
  expression: z.string(),
  description: z.string(),
  variables: z.array(variable),
});

export default function CreateFormulaForm() {
  const [testOK, setTestOK] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variables: [],
      expression: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  const addNewVariable = () => {
    const variables = form.getValues("variables");
    variables.push({
      name: "",
      value: 0,
      unit: "",
      description: "",
    });

    form.setValue("variables", variables);
  };

  const removeVariable = (id: number) => {
    const variables = form.getValues("variables");
    delete variables[id];

    form.setValue("variables", variables);
  };

  const evaluateExpression = () => {
    // setTestOK((testOK) => (testOK = true));
    try {
      const v = Object.values(form.getValues("variables")) ?? [];
      const variables = v.reduce<Record<string, number>>((acc, item) => {
        acc[item.name] = item.value;
        return acc;
      }, {});

      variables["consumption"] = 30;

      const res = evaluate(form.getValues("expression") ?? "", variables);

      setResult((result) => (result = res));
      setTestOK((testOK) => (testOK = true));
    } catch (error) {
      setResult((result) => (result = String(error)));
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
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
                    <Input {...field} />
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
                  <AnimatePresence>
                    {!testOK && (
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
                  </AnimatePresence>
                  <Alert>
                    <AlertTitle>Define your expression here</AlertTitle>
                    <AlertDescription>
                      Define your formula clearly. Start by identifying the
                      variables you will use (e.g., price, quantity, taxRate,
                      discount). Then, combine these variables into a
                      mathematical equation that calculates the total amount to
                      be paid. For example: (price * quantity) * (1 + taxRate) -
                      discount. Make sure the formula follows the correct order
                      of operations so the result is accurate.
                    </AlertDescription>
                  </Alert>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="eg. (consumption * rate_per_unit)"
                    />
                  </FormControl>
                  <span className="flex gap-1">
                    <Input
                      disabled={true}
                      value={result}
                      placeholder="Results"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className=""
                      onClick={evaluateExpression}
                      disabled={form.watch("expression").length === 0}
                    >
                      Test
                    </Button>
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <h3 className="font-bold text-xl">Formula Variables</h3>

              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={addNewVariable}
              >
                <Plus />
              </Button>
            </div>
            <div className="space-y-2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex gap-4 py-4">
                      <div>
                        <Button
                          type="button"
                          size="icon"
                          className="w-6 h-6"
                          variant="outline"
                          disabled
                        >
                          <XIcon />
                        </Button>
                      </div>
                      <div className="grow space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col space-y-1">
                            <span>Name</span>
                            <Input disabled placeholder="consumption" />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span>Value</span>
                            <Input disabled placeholder="10" />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span>Unit</span>
                            <Input disabled placeholder="m3" />
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span>Description</span>
                          <Textarea
                            disabled
                            placeholder="This is automatically added during computation."
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {form.watch("variables").map((variable, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex gap-4 py-4">
                        <div className="">
                          <Button
                            type="button"
                            size="icon"
                            className="w-6 h-6"
                            variant="outline"
                            onClick={() => removeVariable(index)}
                          >
                            <XIcon />
                          </Button>
                        </div>
                        <div className="grow space-y-2">
                          <Collapsible>
                            <div className="flex items-end gap-2">
                              <div className="grow grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="variables"
                                  render={() => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input
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
                                  name="variables"
                                  render={({}) => (
                                    <FormItem>
                                      <FormLabel>Value</FormLabel>
                                      <Input
                                        {...form.register(
                                          `variables.${index}.value`
                                        )}
                                        type="number"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button
                                  size="icon"
                                  type="button"
                                  variant="ghost"
                                >
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
        <div className="grid w-full md:w-fit">
          <Button type="submit" disabled={!testOK} className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
