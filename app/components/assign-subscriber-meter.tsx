import { useState } from "react";
import SelectSubscriberInput from "./select-subscriber-input";
import { useAssignMeterMutation } from "~/redux/apis/meterapi";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export interface AssignSubscriberMeterProps {
  id: number;
  subscriber_id: number;
}

export default function AssignSubscriberMeter({
  id,
  subscriber_id,
}: AssignSubscriberMeterProps) {
  const [assignMeter, result] = useAssignMeterMutation();
  const [value, setValue] = useState<number>(subscriber_id); // Set initial subscriber
  const navigate = useNavigate();

  return (
    <div className="">
      <SelectSubscriberInput
        value={value}
        className="border-transparent shadow-none in-focus-within:border"
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
              error: () => {
                setValue(subscriber_id);
                return "Failed to assign meter. Subscriber is already assigned to a different meter";
              },
            }
          );
        }}
        disabled={result.isLoading}
      />
    </div>
  );
}
