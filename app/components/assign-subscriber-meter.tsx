import { useState } from "react";
import SelectSubscriberInput from "./select-subscriber-input";
import {
  useAssignMeterMutation,
  useClearMeterMutation,
} from "~/redux/apis/meterApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { ApiError } from "~/types";
import { Button } from "./ui/button";
import { Ban } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import ConfirmationDialog from "./confirmation-dialog";

export interface AssignSubscriberMeterProps {
  id: number;
  subscriber_id: number;
}

export default function AssignSubscriberMeter({
  id,
  subscriber_id,
}: AssignSubscriberMeterProps) {
  const [assignMeter, assignResult] = useAssignMeterMutation();
  const [clearMeter, clearResult] = useClearMeterMutation();
  const [value, setValue] = useState<number>(subscriber_id); // Set initial subscriber
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex clear-both mr-8 gap-1">
      <Button
        size="icon"
        variant="outline"
        disabled={
          clearResult.isLoading || assignResult.isLoading || value === 0
        }
        onClick={() => {
          setOpen(true);
        }}
      >
        <Ban className="w-4 h-4" />
      </Button>
      <SelectSubscriberInput
        value={value}
        className="flex border-transparent shadow-none in-focus-within:border bg-transparent"
        onSelect={(new_subscriber_id) => {
          setValue(new_subscriber_id);
          toast.promise(
            assignMeter({
              id: id,
              subscriber: new_subscriber_id,
            }).unwrap(),
            {
              loading: "Assigning subscriber",
              success: "Successfully assigned subscriber to meter!",
              error: (response) => {
                setValue(subscriber_id);

                if ("status" in response) {
                  return (response as ApiError).data.errors[0];
                } else {
                  return "Unknown Error Occured";
                }
              },
            }
          );
        }}
        disabled={clearResult.isLoading || assignResult.isLoading}
      />
      <ConfirmationDialog
        title="Clear Subscriber from Meter"
        description="Are you sure you want to clear subscriber from the meter?"
        open={open}
        setOpen={setOpen}
        action={() => {
          setValue(0);
          setOpen(false);
          toast.promise(clearMeter(id).unwrap(), {
            loading: "Removing subscriber from meter...",
            success: "Successfully removed subscriber from meter",
            error: (response) => {
              setValue(subscriber_id);

              if ("status" in response) {
                return (response as ApiError).data.errors[0];
              } else {
                return "Unknown Error Occured";
              }
            },
          });
        }}
      />
    </div>
  );
}
