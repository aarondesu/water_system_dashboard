import GenerateInvoiceForm from "~/components/forms/generate-invoice-form";

export function meta() {
  return [{ title: "Generate Invoices | Dashboard" }];
}

export default function GenerateInvoicesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Generate Invoice</h2>
        <span className="text-muted-foreground">
          Automatically generates invoices based on the selected reading periods
        </span>
      </div>
      <div className="">
        <GenerateInvoiceForm />
      </div>
    </div>
  );
}
