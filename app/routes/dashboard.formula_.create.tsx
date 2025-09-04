import FormulaForm from "~/components/forms/formula-form";

export default function FormulaCreatePage() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold">Create Formula</h3>
      <div className="space-y-4">
        <FormulaForm />
      </div>
    </div>
  );
}
