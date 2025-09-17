import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react";
import { useDeleteFormulaMutation } from "~/redux/apis/formulaApi";
import { useConfirmationDialog } from "./confirmation-dialog-provider";
import { toast } from "sonner";
import type { ApiError } from "~/types";
import { Link } from "react-router";

interface FormulaActionDropdownProps {
  id: number;
}

export default function FormulaActionDropdown({
  id,
}: FormulaActionDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteFormula] = useDeleteFormulaMutation();
  const { createDialog } = useConfirmationDialog();

  const onDeleteFormula = useCallback(() => {
    createDialog({
      title: "Delete formula",
      description:
        "Are you sure you want to delete the selected formula? Action is irreversible",
      action: () => {
        toast.promise(deleteFormula(id).unwrap(), {
          loading: "Deleting formula...",
          success: "Successfully deleted formula",
          error: (error) => {
            if ("data" in error) {
              return (error as ApiError).data.errors[0];
            }

            return "Server error";
          },
        });
      },
    });
  }, [deleteFormula]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" type="button" className="p-0" size="icon">
          <MoreHorizontalIcon className="" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to={`/dashboard/formula/edit/${id}`}>
            <Pencil />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDeleteFormula}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
