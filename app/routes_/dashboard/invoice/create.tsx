import CreateInvoiceForm from "~/components/forms/create-invoice-form";
import CreateMeterForm from "~/components/forms/create-meter-form";

export function meta() {
  return [{ title: "Create Invoice | Dashboard" }];
}

export default function CreateInvoicePage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Invoice</h2>
      </div>
      <div className="">
        <CreateInvoiceForm />
      </div>
    </div>
  );
}
