import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import dayjs from "dayjs";
import { cn } from "~/lib/utils";
import { useState } from "react";

interface DateSelectorProps {
  value: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export default function DateSelector({
  value,
  disabled,
  onSelect,
  className,
}: DateSelectorProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between",
            className,
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value ? (
            value ? (
              <>{dayjs(value).format("MMMM DD, YYYY")}</>
            ) : (
              "Select Date..."
            )
          ) : (
            "Select Date..."
          )}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          initialFocus
          mode="single"
          defaultMonth={value}
          onSelect={(date) => {
            setOpen(false);
            onSelect(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
