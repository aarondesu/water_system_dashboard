import CreateMultipleReadingsForm from "~/components/forms/create-multiple-readings-form";

export function meta() {
  return [{ title: "Create Invoices | Dashbaord" }];
}

export default function CreateMultipleReadings() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Multiple Readings</h2>
        <span className="text-muted-foreground">
          Fill up the required fields
        </span>
      </div>
      <div className="">
        <CreateMultipleReadingsForm />
      </div>
    </div>
  );
}
