import CreateMeterForm from "~/components/forms/create-meter-form";

export function meta() {
  return [{ title: "Create Meter | Dashboard" }];
}

export default function CreateMeterPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Meter</h2>
      </div>
      <div className="">
        <CreateMeterForm />
      </div>
    </div>
  );
}
