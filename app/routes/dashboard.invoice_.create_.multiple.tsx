import CreateMultipleInvoicesForm from "~/components/forms/create-mulitple-invoices-form";

export default function CreateMultipleInvoicesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Multiple Invoice</h2>
      </div>
      <div className="">
        <CreateMultipleInvoicesForm />
      </div>
    </div>
  );
}
