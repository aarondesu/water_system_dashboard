import InvoiceBill from "~/components/invoice-bill";
import { Button } from "~/components/ui/button";
import { FileText, Printer, Terminal } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { use, useRef } from "react";
import { useGetInvoiceQuery } from "~/redux/apis/invoiceApi";
import { useParams } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function ViewInvoicePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const params = useParams();
  const { data, isLoading } = useGetInvoiceQuery(Number(params.id));

  if (params.id === undefined || isLoading || !data) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="flex min-h-svh">
        <div className="container max-w-[1240px] mx-auto">
          <div className="space-y-4">
            <Alert variant="default">
              <FileText />
              <AlertTitle>View Invoice</AlertTitle>
            </Alert>
            <div className="border rounded-md">
              <InvoiceBill invoice={data} ref={contentRef} />
            </div>
            <div className="">
              <Button onClick={reactToPrintFn}>
                <Printer />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
