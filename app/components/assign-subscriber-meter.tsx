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
import { useConfirmationDialog } from "./confirmation-dialog-provider";

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
  const isMobile = useIsMobile();
  const { createDialog } = useConfirmationDialog();

  return (
    <div className="flex clear-both mr-8 gap-1">
      <SelectSubscriberInput
        value={value}
        className="flex border-transparent shadow-none in-focus-within:border bg-transparent"
        skipMeter={true}
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
    </div>
  );
}
