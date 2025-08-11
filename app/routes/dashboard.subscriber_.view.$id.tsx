import { useParams } from "react-router";
import SubscriberInvoiceTable from "~/components/tables/subscriber-invoice-table";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetSubscriberQuery } from "~/redux/apis/subscriberApi";

export function meta() {
  return [{ title: "View Subscriber | Dashboard" }];
}

export default function ViewSubscriberPage() {
  const params = useParams();
  const { data, isLoading } = useGetSubscriberQuery({ id: Number(params.id) });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-bold text-3xl">View Subscriber</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 text-sm">
          <h5 className="font-bold text-md">Account Details</h5>
          <div className="flex flex-col">
            <span className="font-semibold">Last Name</span>
            <span className="text-muted-foreground">
              {data?.last_name ?? <Skeleton className="h-6 w-full" />}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">First Name</span>
            <span className="text-muted-foreground">
              {data?.first_name ?? <Skeleton className="h-6 w-full" />}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Address</span>
            <span className="text-muted-foreground">
              {data?.address ?? <Skeleton className="h-6 w-full" />}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Email Address</span>
            <span className="text-muted-foreground">
              {data?.email ?? <Skeleton className="h-6 w-full" />}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Mobile Number</span>
            <span className="text-muted-foreground">
              {data?.mobile_number ?? <Skeleton className="h-6 w-full" />}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Assigned Meter</span>
            <span className="text-muted-foreground">
              {data?.meter.number ?? <Skeleton className="h-6 w-full" />}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 text-sm">
            <h5 className="font-bold">Invoice Details</h5>
            <SubscriberInvoiceTable
              data={data?.invoices || []}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <h5 className="font-bold">Transaction Details</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
