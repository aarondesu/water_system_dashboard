import {
  Droplets,
  Info,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserMinus,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { useState } from "react";
import {
  useClearMeterMutation,
  useDeleteMeterMutation,
  useSetStatusMutation,
} from "~/redux/apis/meterApi";
import { toast } from "sonner";
import { useConfirmationDialog } from "./confirmation-dialog-provider";
import type { Row } from "@tanstack/react-table";
import type { ApiError, Meter } from "~/types";

interface MeterActionDropdownProps {
  id: number;
  row: Row<Meter>;
}

export default function MeterActionDropdown({
  id,
  row,
}: MeterActionDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteMeter, result] = useDeleteMeterMutation();
  const { createDialog } = useConfirmationDialog();
  const [clearMeter, clearMeterResults] = useClearMeterMutation();
  const [setMeterStatus, statusResults] = useSetStatusMutation();
  const [status, setStatus] = useState<"active" | "inactive">(
    row.original.status
  );

  const handleUnassign = () => {
    createDialog({
      title: "Unassign Meter",
      description:
        "Are you sure you want to unassign this meter? Action is irreversible.",
      action: () => {
        toast.promise(clearMeter(id).unwrap(), {
          loading: "Unassigning meter...",
          success: "Successfully unassigned meter",
          error: (error) => {
            if ("status" in error) {
              return (error as ApiError).data.errors[0];
            } else {
              return "Unknown Error Occurred";
            }
          },
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={statusResults.isLoading}
          >
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/reading/create?meter=${id}`}>
              <Droplets />
              <span>Create Reading</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleUnassign}
            disabled={row.original.subscriber_id === null}
          >
            <span className="flex items-center space-x-2">
              <UserMinus className="w-4 h-4" />
              <span>Unassign</span>
            </span>
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
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(value) => {
                      setMeterStatus({
                        id: row.original.id || 0,
                        status: value === "active" ? "active" : "inactive",
                      });
                      setStatus(value === "active" ? "active" : "inactive");
                    }}
                  >
                    <DropdownMenuRadioItem value="active">
                      Active
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="inactive">
                      Inactive
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/meter/edit/${id}`}>
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
