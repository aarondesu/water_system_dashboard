import type { Route } from "./+types/view";
import UsersTable from "~/components/tables/users-table";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Users | Dashboard" }];
}

export default function ViewUsersPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-bold text-3xl">Users</h2>
      </div>
      <UsersTable />
    </div>
  );
}
