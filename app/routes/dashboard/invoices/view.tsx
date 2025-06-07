import CreateMeterForm from "~/components/forms/create-meter-form";
import InvoicesTable from "~/components/tables/invoices-table";

export function meta() {
  return [{ title: "Invoices | Dashboard" }];
}

export default function ViewInvoicesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Invoices</h2>
        <span className="text-muted-foreground">List of all invoices</span>
      </div>
      <div className="">
        <InvoicesTable />
      </div>
    </div>
  );
}
