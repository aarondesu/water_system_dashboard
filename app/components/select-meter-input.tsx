import { useState } from "react";
import { useGetAllMetersQuery } from "~/redux/apis/meterApi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ChevronsUpDown, FastForward } from "lucide-react";

interface SelectMeterInputProps {
  value: number;
  onSelect: (id: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function SelectMeterInput({
  value,
  disabled = false,
  className,
  onSelect,
}: SelectMeterInputProps) {
  const { data, isLoading } = useGetAllMetersQuery();

  const [open, setOpen] = useState<boolean>(false);
  const meter = data?.find((u) => u.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between w-full",
            !value && "text-muted-foreground"
          )}
          disabled={isLoading || disabled}
        >
          {value
            ? meter
              ? `Meter # ${meter.number} ${
                  meter.subscriber
                    ? `- ${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                    : ``
                }`
              : "Select Meter"
            : "Select Meter"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search meter" />
          <CommandList>
            <CommandEmpty>No meter found</CommandEmpty>
            <CommandGroup>
              {data &&
                data.map((meter) => (
                  <CommandItem
                    key={meter.id}
                    value={`${meter.number} ${
                      meter.subscriber
                        ? `- ${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                        : ``
                    }`}
                    onSelect={() => {
                      onSelect(meter.id || 0);
                      setOpen(false);
                    }}
                  >
                    {`Meter # ${meter.number} ${
                      meter.subscriber
                        ? `- ${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                        : ``
                    }`}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
