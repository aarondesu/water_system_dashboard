import CreateUserForm from "~/components/forms/create-user-form";

export function meta() {
  return [{ title: "Create New User | Dashboard" }];
}

export default function CreateUsersPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Create User</h2>
        <span className="text-muted-foreground">
          Fill up the required details below
        </span>
      </div>
      <div className="">
        <CreateUserForm />
      </div>
    </div>
  );
}
