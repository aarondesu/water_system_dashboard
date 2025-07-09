import CreateReadingsForm from "~/components/forms/create-readings-form";

export function meta() {
  return [{ title: "Create Reading | Dashboard" }];
}

export default function CreateReadingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Readings</h2>
        <span className="text-muted-foreground">
          Fill up the required fields
        </span>
      </div>
      <div className="">
        <CreateReadingsForm />
      </div>
    </div>
  );
}
