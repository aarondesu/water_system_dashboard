import type { DateRange } from "react-day-picker";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { useState } from "react";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export interface DatePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export default function DateRangePicker({
  value,
  onChange = (range: DateRange | undefined) => null,
  className,
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(value);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("grid gap-2", className)}>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              id="date"
              role="dialog"
              variant="outline"
              className={cn(
                "min-w-[300px] justify-between text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon />
              {date?.from ? (
                date?.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <ChevronsUpDown />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Period of water</DialogTitle>
            </DialogHeader>
            <div className="grid place-content-center">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  onChange(date);
                }}
                numberOfMonths={2}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Back</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  } else {
    return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              role="dialog"
              variant="outline"
              className={cn(
                "min-w-[300px] justify-between text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <span className="flex items-center gap-2 justify-start">
                <CalendarIcon />
                {date?.from ? (
                  date?.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </span>
              <ChevronsUpDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(date) => {
                setDate(date);
                if (date?.from && date.to) {
                  onChange(date);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
}
