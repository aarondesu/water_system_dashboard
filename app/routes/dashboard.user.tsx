import { Button } from "~/components/ui/button";
import type { Route } from "./+types/dashboard.user";
import UsersTable from "~/components/tables/users-table";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import CreateUserForm from "~/components/forms/create-user-form";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Users | Dashboard" }];
}

export default function DashboardUsersPage() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Users</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus /> Create new user
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateUserForm onCreateSuccess={() => setOpen((open) => false)} />
          </DialogContent>
        </Dialog>
      </div>
      <UsersTable />
    </div>
  );
}
