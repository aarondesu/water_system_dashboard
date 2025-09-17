import { Loader2 } from "lucide-react";
import { useParams } from "react-router";
import FormulaForm from "~/components/forms/formula-form";
import { formulaApi, useGetFormulaQuery } from "~/redux/apis/formulaApi";
import type { Route } from "./+types/dashboard.formula_.edit.$id";
import { store } from "~/redux/store";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);

  const result = await store.dispatch(
    formulaApi.endpoints.getFormula.initiate(id)
  );

  return result;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Edit Formula | Dashboard" }];
}

export default function FormulaEditPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold">Edit Formula</h3>
      <div className="space-y-4">
        {loaderData.isLoading ? (
          <div className="">
            <Loader2 className="animate-spin" />
          </div>
        ) : loaderData.isError ? (
          <div>Failed to get</div>
        ) : (
          <FormulaForm data={loaderData.data} mode="edit" />
        )}
      </div>
    </div>
  );
}
