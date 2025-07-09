import { Printer } from "lucide-react";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { useGetInvoiceQuery } from "~/redux/apis/invoiceApi";

export default function ViewInvoicePage() {
  const params = useParams();
  const id = Number(params.id);

  const { data } = useGetInvoiceQuery(id);

  const InvoiceDetails = () => (
    <div className="bg-white p-6 flex flex-col gap-4 text-sm min-w-[480px]">
      <div className="flex flex-col mb-14">
        <h2 className="text-center text-lg font-black">Invoice Details</h2>
        <span className="text-center text-sm">Test</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Subscriber</span>
          <span className="text-md font-bold p-1">{`${data?.subscriber.last_name}, ${data?.subscriber.first_name}`}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Meter No.</span>
          <span className="text-md font-bold p-1">{data?.meter.number}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Address</span>
        <span className="text-md font-bold p-1">
          {data?.subscriber.address}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-muted">
      <div className="m-auto flex flex-col gap-2 max-w-[780px]">
        <div className="bg-white border rounded-md ">
          <InvoiceDetails />
        </div>
        <div className="">
          <Button className="justify-between">
            <Printer />
            Print Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
