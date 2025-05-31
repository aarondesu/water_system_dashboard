import MetersTable from "~/components/tables/meters-table";
import ReadingsTable from "~/components/tables/readings-table";

export function meta() {
  return [{ title: "Readings | Dashboard" }];
}

export default function ViewReadingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Readings</h2>
        <span className="text-muted-foreground">List of all readings</span>
      </div>
      <div className="">
        <ReadingsTable />
      </div>
    </div>
  );
}
