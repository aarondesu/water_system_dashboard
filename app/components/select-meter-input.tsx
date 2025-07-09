import { useEffect, useState } from "react";
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
import type { Meter, Subscriber } from "~/types";

interface SelectMeterInputProps {
  disabled?: boolean;
  data: (Meter & {
    subscriber?: Subscriber;
  } & Record<string, any>)[];
  onChange?: (value: number) => void;
  value?: number;
  className?: string;
}

export default function SelectMeterInput({
  disabled = false,
  data,
  value: defaultValue = 0,
  onChange = () => null,
  className,
}: SelectMeterInputProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(defaultValue);

  const meter = data.find((meter) => meter.id === value);

  useEffect(() => {
    if (defaultValue && value !== defaultValue) {
      setValue((value) => defaultValue);
    }
  }, [defaultValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[300px] justify-between", className)}
          disabled={disabled}
        >
          {value
            ? meter
              ? `${meter?.number} - ${
                  meter.subscriber
                    ? `${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                    : `Unassigned`
                }`
              : "Select meter..."
            : "Select Meter..."}
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search meter..." />
          <CommandEmpty>No meter found</CommandEmpty>
          <CommandList>
            {data.map((meter, index) => (
              <CommandItem
                key={index}
                value={`${meter.number} ${
                  meter.subscriber
                    ? `- ${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                    : `Unassigned`
                }`}
                onSelect={(currentValue) => {
                  setValue(meter.id || 0);
                  onChange(meter.id || 0);
                  setOpen(false);
                }}
              >
                {`${meter.number} - ${
                  meter.subscriber
                    ? `${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                    : `Unassigned`
                }`}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
