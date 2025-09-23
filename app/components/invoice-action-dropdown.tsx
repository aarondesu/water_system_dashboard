import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useConfirmationDialog } from "./confirmation-dialog-provider";
import { useDeleteInvoiceMutation } from "~/redux/apis/invoiceApi";
import { toast } from "sonner";
import type { ApiError } from "~/types";

interface InvocieActionDropdownProps {
  id: number;
}

export default function InvoiceActionDropdown({
  id,
}: InvocieActionDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { createDialog } = useConfirmationDialog();
  const [deleteInvoice, results] = useDeleteInvoiceMutation();

  const onDelete = useCallback(
    (id: number) => {
      createDialog({
        title: "Delete Invoice",
        description:
          "Are you sure you want to delete the invoice? Action is irreversible",
        action: () => {
          toast.promise(deleteInvoice(id).unwrap(), {
            loading: "Deleting invoice...",
            success: "Successfully deleted invoice",
            error: (error) => {
              if ("data" in error) {
                return (error as ApiError).data.errors[0];
              }

              return "Internal Server Error";
            },
          });
        },
      });
    },
    [createDialog, id]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className="h-8 w-8 p-0"
          disabled={results.isLoading}
        >
          <span className="sr-only">Open Menu</span>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(id)}
          disabled={results.isLoading}
        >
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
