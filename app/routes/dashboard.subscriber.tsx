import SubscribersTable from "~/components/tables/subscribers-table";

export function meta() {
  return [{ title: "Subscribers | Dashboard" }];
}

export default function DashboardSubscriberPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-bold text-3xl">Subscribers</h2>
      </div>
      <SubscribersTable />
    </div>
  );
}
