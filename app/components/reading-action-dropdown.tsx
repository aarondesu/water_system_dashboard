import { FilePlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
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
import { useDeleteReadingMutation } from "~/redux/apis/readingApi";
import { toast } from "sonner";
import type { ApiError, Meter, Reading, Subscriber } from "~/types";
import { Dialog } from "./ui/dialog";
import { useConfirmationDialog } from "./confirmation-dialog-provider";
import { useState } from "react";
import type { Row } from "@tanstack/react-table";

interface ReadingActionDropdownProps {
  row: Row<Reading & { meter: Meter & { subscriber?: Subscriber } }>;
}

export default function ReadingActionDropdown({
  row,
}: ReadingActionDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteReading, deleteResults] = useDeleteReadingMutation();
  const { createDialog } = useConfirmationDialog();

  return (
    <>
      <Dialog>
        <DropdownMenu modal={false}>
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
                <Link
                  to={`/dashboard/invoice/create?subscriber_id=${row.original.meter.subscriber?.id}&reading_id=${row.original.id}`}
                >
                  <FilePlus />
                  <span>Create Invoice</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/reading/edit?id=${row.original.id}`}>
                  <Pencil />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  createDialog({
                    title: "Delete Reading",
                    description:
                      "Are you sure you want to delete this reading? Action is irreversible",
                    action: () => {
                      toast.promise(
                        deleteReading(row.original.id || 0).unwrap(),
                        {
                          loading: "Deleting reading...",
                          success: "Successfully deleted reading",
                          error: (error) => {
                            if ("data" in error) {
                              return (error as ApiError).data.errors[0];
                            } else {
                              return "Unhandled error";
                            }
                          },
                        }
                      );
                    },
                  });
                }}
              >
                <Trash2 />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
}
