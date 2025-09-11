import { store } from "~/redux/store";
import type { Route } from "./+types/dashboard.formula";
import { formulaApi } from "~/redux/apis/formulaApi";
import FormulaTable from "~/components/tables/formula-table";
import { Button } from "~/components/ui/button";
import { ClockPlus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import { Link } from "react-router";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const result = await store
    .dispatch(formulaApi.endpoints.getAllFormulas.initiate())
    .unwrap()
    .then((data) => data)
    .catch((error) => {
      console.log(error);
      return undefined;
    });

  return { formulas: result };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Formulas | Dashboard" }];
}

export default function FormulaPage({}: Route.ComponentProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Formulas</h2>
        <Button variant="outline" asChild>
          <Link to="/dashboard/formula/create">
            <ClockPlus /> Create new Formula
          </Link>
        </Button>
      </div>
      <div className="">
        <FormulaTable />
      </div>
    </div>
  );
}
