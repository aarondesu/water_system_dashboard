import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useGetAllFormulasQuery } from "~/redux/apis/formulaApi";
import type { Formula, FormulaVariable } from "~/types";
import { evaluate } from "mathjs";
import { Input } from "~/components/ui/input";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export function meta() {
  return [{ title: "Formulas | Dashboard" }];
}

export default function FormulaPage() {
  const { data, isLoading } = useGetAllFormulasQuery();
  const [result, setResult] = useState<string>();
  const [selectedFormula, setSelectedFormula] = useState<
    Formula & { variables: FormulaVariable[] }
  >();

  let variables = selectedFormula?.variables.reduce<Record<string, any>>(
    (acc, item) => {
      acc[item.name] = item.value;
      return acc;
    },
    {}
  );

  if (variables) {
    variables["consumption"] = 10;
  }

  const evaluateExpression = () => {
    setResult(
      (result) =>
        (result = evaluate(selectedFormula?.expression ?? "", variables))
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Formulas</h2>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Select
            onValueChange={(value) => {
              const formula = data?.find((f) => f.id === Number(value));
              setSelectedFormula((selected) => (selected = formula));
            }}
          >
            <SelectTrigger disabled={!data || data.length === 0 || isLoading}>
              <SelectValue placeholder="Select a formula" />
            </SelectTrigger>
            <SelectContent>
              {data?.map((formula) => (
                <SelectItem key={formula.id} value={formula.id.toString()}>
                  {formula.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" asChild>
            <Link to={"/dashboard/formula/create"}>
              <Plus />
              <span>New</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Selected Formula</h3>
            <Textarea
              disabled={true}
              value={selectedFormula && selectedFormula.expression}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Variables</h3>
            <div className="space-y-2">
              {variables &&
                Object.entries(variables).map(([key, value], index) => (
                  <span key={index} className="">
                    <span>{key}</span>
                    <Input value={value} disabled={key === "consumption"} />
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-xl">Result</h3>
          <Input disabled={true} value={result} />
          <Button disabled={!selectedFormula} onClick={evaluateExpression}>
            Test
          </Button>
        </div>
      </div>
    </div>
  );
}
