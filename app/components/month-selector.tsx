import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

interface MonthSelectorProps {
  value?: string;
  onChange?: (args: any) => void;
  className?: string;
}

export default function MonthSelector({
  value = "",
  onChange = (args: any) => null,
  className,
}: MonthSelectorProps) {
  const [internalValue, setIntervalValue] = useState<string>();

  return (
    <Select
      onValueChange={(value) => {
        setIntervalValue(value);
        onChange(value);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Month..." />
      </SelectTrigger>
      <SelectContent>
        {months.map((month, index) => (
          <SelectItem key={index} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
