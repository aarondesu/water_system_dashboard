import EditMeterForm from "~/components/forms/edit-meter-form";

export function meta() {
  return [{ title: "Create Meter | Dashboard" }];
}

export default function EditMeterPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Edit Meter</h2>
      </div>
      <div className="">
        <EditMeterForm />
      </div>
    </div>
  );
}
