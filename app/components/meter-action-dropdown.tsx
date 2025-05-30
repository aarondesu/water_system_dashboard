import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { useState } from "react";
import ConfirmationDialog from "./confirmation-dialog";
import { useDeleteMeterMutation } from "~/redux/apis/meterapi";
import { toast } from "sonner";

interface MeterActionDropdownProps {
  id: number;
}

export default function MeterActionDropdown({ id }: MeterActionDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteMeter, result] = useDeleteMeterMutation();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/meters/edit?id=${id}`}>
                <Pencil />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash2 />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Delete Meter"
        description="Are you sure you want to delete the selected meter? Action is irreversible"
        open={open}
        setOpen={setOpen}
        disabled={result.isLoading}
        action={() => {
          toast.promise(deleteMeter(id).unwrap(), {
            loading: "Deleting meter...",
            success: () => {
              setOpen(false);
              return "Successfully deleted meter";
            },
            error: "Failed to delete meter",
          });
        }}
      />
    </>
  );
}
