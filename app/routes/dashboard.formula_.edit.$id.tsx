import { Loader2 } from "lucide-react";
import { useParams } from "react-router";
import FormulaForm from "~/components/forms/formula-form";
import { useGetFormulaQuery } from "~/redux/apis/formulaApi";

export default function FormulaEditPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useGetFormulaQuery(id);

  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold">Edit Formula</h3>
      <div className="space-y-4">
        {isLoading ? (
          <div className="">
            <Loader2 className="animate-spin" />
          </div>
        ) : isError ? (
          <div>Failed to get</div>
        ) : (
          <FormulaForm data={data} mode="edit" />
        )}
      </div>
    </div>
  );
}
