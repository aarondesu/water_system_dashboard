import MetersTable from "~/components/tables/meters-table";

export function meta() {
  return [{ title: "Meters | Dashboard" }];
}

export default function ViewMetersPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="">
        <h2 className="font-bold text-3xl">Meters</h2>
        <span className="text-muted-foreground">List of all meters</span>
      </div>
      <div className="">
        <MetersTable />
      </div>
    </div>
  );
}
