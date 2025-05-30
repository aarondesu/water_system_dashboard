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
import ConfirmationDialog from "./confirmation-dialog";
import { useDeleteSubscriberMutation } from "~/redux/apis/subscriberApi";
import { toast } from "sonner";
import { useState } from "react";

interface SubscriberActionDropdownProps {
  id: number;
}

export default function SubscriberActionDropdown({
  id,
}: SubscriberActionDropdownProps) {
  const [deleteSubscriber, deleteResults] = useDeleteSubscriberMutation();
  const [open, setOpen] = useState<boolean>(false);

  const onDeleteSubscriber = (id: number) => {
    toast.promise(deleteSubscriber(id).unwrap(), {
      loading: "Deleting subscriber...",
      success: "Successfully deleted subscriber",
      error: "Failed to delete subscriber",
    });
  };

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
              <Link to={`/dashboard/subscribers/edit?id=${id}`}>
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
        open={open}
        title="Delete Subscriber"
        description="Are you sure you want to delete this subscriber? Action is irreversible."
        action={() => {
          setOpen(false);
          onDeleteSubscriber(id);
        }}
      />
    </>
  );
}
