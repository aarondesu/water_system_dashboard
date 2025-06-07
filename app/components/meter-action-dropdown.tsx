import { Info, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { useState } from "react";
import { useDeleteMeterMutation } from "~/redux/apis/meterApi";
import { toast } from "sonner";
import { useConfirmationDialog } from "./confirmation-dialog-provider";

interface MeterActionDropdownProps {
  id: number;
}

export default function MeterActionDropdown({ id }: MeterActionDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteMeter, result] = useDeleteMeterMutation();
  const { createDialog } = useConfirmationDialog();

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
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/readings/create?meter=${id}`}>
              <Plus />
              <span>Create Reading</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>Status</span>
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/meters/edit?id=${id}`}>
                <Pencil />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                createDialog({
                  title: "Delete Meter",
                  description:
                    "Are you sure you want to delete the selected meter? Action is irreversible",
                  action: () => {
                    toast.promise(deleteMeter(id).unwrap(), {
                      loading: "Deleting meter...",
                      success: "Successfully deleted meter",
                      error: "Failed to delete meter",
                    });
                  },
                })
              }
            >
              <Trash2 />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
