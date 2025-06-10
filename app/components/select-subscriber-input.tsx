import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { useGetAllSubscribersQuery } from "~/redux/apis/subscriberApi";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Skeleton } from "./ui/skeleton";

interface SelectSubscriberInputProps {
  value: number;
  onSelect: (id: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function SelectSubscriberInput({
  value,
  onSelect,
  disabled = false,
  className,
}: SelectSubscriberInputProps) {
  const { data, isLoading, isSuccess } = useGetAllSubscribersQuery({
    order: "asc",
  });

  const [open, setOpen] = useState<boolean>(false);
  const subscriber = data?.find((u) => u.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isLoading || disabled}>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between w-full",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled || isLoading}
        >
          {value
            ? subscriber
              ? `${subscriber?.last_name}, ${subscriber?.first_name}`
              : "Select subscriber..."
            : "Select subscriber..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search Subscriber..." />
          <CommandList>
            <CommandEmpty>No Subscriber Found</CommandEmpty>
            <CommandGroup>
              {data &&
                data.map((subscriber) => (
                  <CommandItem
                    key={subscriber.id}
                    value={`${subscriber.last_name},${subscriber.first_name}`}
                    onSelect={() => {
                      onSelect(subscriber.id || 0);
                      setOpen(false);
                    }}
                  >
                    {`${subscriber.last_name}, ${subscriber.first_name}`}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
