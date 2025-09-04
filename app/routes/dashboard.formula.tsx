import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { useGetAllFormulasQuery } from "~/redux/apis/formulaApi";
import type { Formula, FormulaTableColumn, FormulaVariable } from "~/types";
import { evaluate } from "mathjs";
import { ChevronsUpDown, Pencil, Plus } from "lucide-react";
import { Link } from "react-router";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import SelectFormulaInput from "~/components/select-formula-input";
import { cn, formatNumber } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

export function meta() {
  return [{ title: "Formulas | Dashboard" }];
}

export default function FormulaPage() {
  const { data, isLoading, isSuccess } = useGetAllFormulasQuery();
  const [result, setResult] = useState<string>();
  const [consumption, setConsumption] = useState<number>(10);
  const [selectedFormula, setSelectedFormula] = useState<
    Formula & { variables: FormulaVariable[]; columns: FormulaTableColumn[] }
  >();

  const variables = useMemo(() => {
    const vars = selectedFormula?.variables.reduce<Record<string, any>>(
      (acc, item) => {
        acc[item.name] = item.value;
        return acc;
      },
      {}
    );

    if (vars) {
      vars["consumption"] = consumption;
    }

    return vars;
  }, [selectedFormula, consumption]);

  const evaluateExpression = () => {
    try {
      const evaluated = evaluate(selectedFormula?.expression ?? "", variables);
      console.log(result);

      setResult((result) => (result = String(evaluated)));
    } catch (error) {
      console.error(error);
      setResult((result) => (result = "Error"));
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Formulas</h2>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <SelectFormulaInput
            data={data ?? []}
            disabled={isLoading}
            onChange={(value) => {
              const formula = data?.find((f) => f.id === Number(value));
              setSelectedFormula((selected) => (selected = formula));
            }}
          />
          <Button variant="outline" asChild>
            <Link to={"/dashboard/formula/create"}>
              <Plus />
              <span>New</span>
            </Link>
          </Button>
          <Button variant="outline" disabled={!selectedFormula} asChild>
            <Link
              to={`/dashboard/formula/edit/${selectedFormula?.id}`}
              className={cn(
                !selectedFormula && "pointer-events-none opacity-50"
              )}
            >
              <Pencil />
              <span>Edit</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3
              className="font-bold text-xl
            "
            >
              Formula details
            </h3>
            <div className="">
              <h5 className="font-semibold">Name</h5>
              <span className="text-muted-foreground text-sm">
                {selectedFormula ? (
                  selectedFormula.name
                ) : (
                  <Skeleton className="w-full h-6" />
                )}
              </span>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold">Description</h5>
              <span className="text-muted-foreground text-sm">
                {selectedFormula ? (
                  (selectedFormula.description ?? (
                    <Skeleton className="w-full h-6" />
                  ))
                ) : (
                  <Skeleton className="w-full h-6" />
                )}
              </span>
            </div>

            <div className="space-y-2">
              <h5 className="font-semibold">Expression</h5>
              <span className="text-muted-foreground text-sm">
                {selectedFormula ? (
                  selectedFormula.expression
                ) : (
                  <Skeleton className="w-full h-20" />
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">Result</h3>
              <div className="flex gap-1">
                <div className="p-2 text-muted-foreground border rounded-md text-sm grow">
                  {formatNumber(Number(result)) ?? "N/A"}
                </div>
                <Button
                  disabled={!selectedFormula}
                  onClick={evaluateExpression}
                >
                  Test
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-xl">Formula Variables</h3>
            <Table className="space-y-4">
              <TableBody>
                {selectedFormula && (
                  <TableRow>
                    <TableCell className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <div className="font-semibold">Name</div>
                          <div>
                            <Input disabled placeholder="consumption" />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Value</div>
                          <div>
                            <Input
                              disabled
                              placeholder={formatNumber(consumption)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="font-semibold">Unit</div>
                        <div>
                          <Input disabled placeholder="m³" />
                        </div>
                      </div>
                      <div className="">
                        <div className="font-semibold">Description</div>
                        <div>
                          <Textarea
                            disabled
                            placeholder="Amount of consumed water. Is automatically added by the system."
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {selectedFormula &&
                  selectedFormula.variables.map((variable, index) => (
                    <TableRow key={index}>
                      <TableCell className="space-y-4">
                        <Collapsible>
                          <div className="flex gap-4 items-end">
                            <div className="grow">
                              <div className="font-semibold">Name</div>
                              <div>
                                <Input disabled placeholder={variable.name} />
                              </div>
                            </div>
                            <div className="grow">
                              <div className="font-semibold">Value</div>
                              <div>
                                <Input
                                  disabled
                                  placeholder={formatNumber(variable.value)}
                                />
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="icon">
                                <ChevronsUpDown />
                              </Button>
                            </CollapsibleTrigger>
                          </div>

                          <CollapsibleContent>
                            <div className="">
                              <div className="font-semibold">Unit</div>
                              <div>
                                <Input
                                  disabled
                                  placeholder={variable.unit ?? "N/A"}
                                />
                              </div>
                            </div>
                            <div className="">
                              <div className="font-semibold">Description</div>
                              <div>
                                <Textarea
                                  disabled
                                  placeholder={variable.description ?? "N/A"}
                                />
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
