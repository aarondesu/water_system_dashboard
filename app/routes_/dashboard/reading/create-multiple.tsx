import CreateMultipleReadingsForm from "~/components/forms/create-multiple-readings-form";

export function meta() {
  return [{ title: "Create Invoices | Dashbaord" }];
}

export default function CreateMultipleReadings() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Multiple Readings</h2>
      </div>
      <div className="">
        <CreateMultipleReadingsForm />
      </div>
    </div>
  );
}
