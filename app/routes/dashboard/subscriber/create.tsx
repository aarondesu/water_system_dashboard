import CreateSubscriberForm from "~/components/forms/create-subscriber-form";

export function meta() {
  return [{ title: "Create | Dashboard" }];
}

export default function CreateSubscribersPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create Subscriber</h2>
        <span className="text-muted-foreground">
          Fill up the required details below
        </span>
      </div>
      <div className="">
        <CreateSubscriberForm />
      </div>
    </div>
  );
}
