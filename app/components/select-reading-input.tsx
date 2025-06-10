import type { Reading } from "~/types";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { useState } from "react";
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
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SelectReadingInputProps {
  data?: Reading[];
  value: number;
  onSelect: (id: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function SelectReadingInput({
  data,
  value,
  onSelect,
  className,
  disabled,
}: SelectReadingInputProps) {
  const [open, setOpen] = useState<boolean>(false);
  const reading = data?.find((u) => u.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between w-full",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {value ? (
            reading ? (
              <span>{reading.reading} m&sup3;</span>
            ) : (
              "Select Reading..."
            )
          ) : (
            "Select Reading..."
          )}
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search Reading..." />
          <CommandList>
            <CommandEmpty>No Reading Found</CommandEmpty>
            <CommandGroup>
              {data &&
                data.map((reading, index) => (
                  <CommandItem
                    key={reading.id}
                    value={String(reading.reading)}
                    className="justify-between"
                    onSelect={() => {
                      onSelect(reading.id || 0);
                      setOpen(false);
                    }}
                  >
                    {`${reading.created_at} - ${reading.reading}`}
                    {index === 0 && <Badge>Latest</Badge>}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
