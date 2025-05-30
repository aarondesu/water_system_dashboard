import SubscribersTable from "~/components/tables/subscribers-table";

export function meta() {
  return [{ title: "Subscribers | Dashboard" }];
}

export default function ViewReadingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-bold text-3xl">Subscribers</h2>
        <span className="text-muted-foreground">
          View every subscriber here
        </span>
      </div>
      <SubscribersTable />
    </div>
  );
}
