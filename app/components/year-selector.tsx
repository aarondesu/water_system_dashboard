import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface YearSelectorProps {
  value?: string;
  onChange?: (year: string) => void;
  startYear?: number;
  endYear?: number;
}

export default function YearSelector({
  value,
  onChange = (year: string) => null,
  startYear = new Date().getFullYear() - 30,
  endYear = new Date().getFullYear(),
}: YearSelectorProps) {
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  );

  return (
    <Select onValueChange={(value) => onChange(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select Month..." />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
