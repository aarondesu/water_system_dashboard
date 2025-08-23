import { useState } from "react";
import type { Formula, FormulaTableColumn, FormulaVariable } from "~/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface SelectFormulaInputProps {
  defaultValue?: number;
  data: (Formula & {
    variables: FormulaVariable[];
    columns: FormulaTableColumn[];
  } & Record<string, any>)[];
  disabled?: boolean;
  className?: string;
  onChange?: (value: number) => void;
}

export default function SelectFormulaInput({
  data,
  defaultValue = 0,
  disabled = false,
  className = "",
  onChange = () => null,
}: SelectFormulaInputProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(defaultValue);

  const formula = data.find((formula) => formula.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-w-[200px] justify-between", className)}
          disabled={disabled}
        >
          {value && formula ? formula.name : "Select Formula..."}
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search formula..." />
          <CommandEmpty>No formula found</CommandEmpty>
          <CommandList>
            {data.map((formula, index) => (
              <CommandItem
                key={index}
                value={formula?.name}
                onSelect={(val) => {
                  setValue((value) => (value = formula?.id));
                  onChange(formula.id);

                  setOpen(false);
                }}
              >
                {formula?.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
