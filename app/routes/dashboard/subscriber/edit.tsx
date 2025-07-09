import EditSubscriberForm from "~/components/forms/edit-subscriber-form";

export function meta() {
  return [{ title: "Edit Subscriber | Dashboard" }];
}

export default function EditSubscriberPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Edit Subscriber</h2>
        <span className="text-muted-foreground">
          Fill up the required details below
        </span>
      </div>
      <div className="">
        <EditSubscriberForm />
      </div>
    </div>
  );
}
