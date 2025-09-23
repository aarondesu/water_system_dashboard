import CreateMeterForm from "~/components/forms/create-meter-form";
import InvoicesTable from "~/components/tables/invoices-table";
import type { Route } from "./+types/dashboard.invoice";
import { invoiceApi, useGetAllInvoiceQuery } from "~/redux/apis/invoiceApi";
import { store } from "~/redux/store";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import CreateReadingsForm from "~/components/forms/create-readings-form";
import CreateInvoiceForm from "~/components/forms/create-invoice-form";
import { ScrollArea } from "~/components/ui/scroll-area";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  // Prefetch data
  await store.dispatch(
    invoiceApi.endpoints.getAllInvoice.initiate({
      page_index: 1,
      rows: 10,
    })
  );
}

export function meta() {
  return [{ title: "Invoices | Dashboard" }];
}

export default function InvoicePage() {
  const [open, setOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data } = useGetAllInvoiceQuery({
    page_index: pagination.pageIndex + 1,
    rows: pagination.pageSize,
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Invoices</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus /> Create new Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[1000px] md:min-w-[1000px]">
            <ScrollArea className="h-svh md:h-fit">
              <DialogHeader>
                <DialogTitle>Create new Invoice</DialogTitle>
                <DialogDescription>
                  Fill in the required fields below
                </DialogDescription>
              </DialogHeader>
              <CreateInvoiceForm onSuccess={() => setOpen((open) => false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <div className="">
        <InvoicesTable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}
