import type { Invoice, Meter, Subscriber } from "~/types";
import {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithRef,
} from "react";
import QRCode from "react-qr-code";

import logo from "~/assets/logoipsum-282.svg";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatNumber } from "~/lib/utils";
import dayjs from "dayjs";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5173/";

interface InvoiceBillProps extends ComponentPropsWithRef<"div"> {
  invoice: Invoice & { subscriber: Subscriber; meter: Meter };
}

export default function InvoiceBill({ invoice, ...props }: InvoiceBillProps) {
  const total_arrears = useMemo<number>(() => {
    if (!invoice.arrears || invoice.arrears.length === 0) return 0;
    return Number(
      invoice.arrears.reduce((total, arrear) => {
        return Number(total) + Number(arrear.amount_due ?? 0);
      }, 0)
    );
  }, []);

  const total_amount_due =
    Number(invoice.amount_due ?? 0) + Number(total_arrears);

  const surcharge = total_amount_due * 0.1; // 10% surcharge

  return (
    <div className="flex flex-col p-10" {...props}>
      <div className="justify-items-center">
        <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
        <h2 className="font-bold text-2xl">Water Utility Bill</h2>
      </div>
      <div className="grid grid-cols-2 text-sm mt-8">
        {/* Left side section for subscriber details */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <span className="flex flex-col">
              <span className="font-semibold">Account No.</span>
              <span>{invoice.subscriber.id?.toString().padStart(6, "0")}</span>
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Account Name</span>
              <span>
                {invoice.subscriber.first_name} {invoice.subscriber.last_name}
              </span>
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Account Address</span>
              <span>{invoice.subscriber.address}</span>
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Meter No.</span>
              <span>{invoice.meter.number}</span>
            </span>
          </div>
        </div>
        {/* Right side section for invoice details */}
        <div className="p-4 bg-background flex flex-col gap-2">
          <span className="flex flex-col">
            <span className="font-semibold">Invoice No.</span>
            <span>{invoice.invoice_number}</span>
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">Meter No.</span>
            <span>{invoice.meter.number}</span>
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">Due Date</span>
            <span>{dayjs(invoice.due_date).format("MMMM D, YYYY")}</span>
          </span>
        </div>
      </div>
      {/* Invoice details section */}
      <div className="mt-8">
        <Table>
          <TableCaption className="select-none">Meter Information</TableCaption>
          <TableHeader className="bg-background">
            <TableRow className="">
              <TableHead className="font-semibold text-foreground">
                Date
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Consumption
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Rate per Unit
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Amount{" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{invoice.created_at}</TableCell>
              <TableCell>
                {formatNumber(invoice.consumption ?? 0)} m&sup3;
              </TableCell>
              <TableCell>
                &#8369; {formatNumber(invoice.rate_per_unit ?? 0)} /m&sup3;
              </TableCell>
              <TableCell>
                &#8369; {formatNumber(invoice.amount_due ?? 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {/* Payment status section */}
      <div className="mt-8 flex flex-col gap-1 p-6 bg-background">
        <div className="grid grid-cols-2">
          <span className="font-semibold text-sm">Amount Due</span>
          <span className="text-end text-sm">
            &#8369; {formatNumber(invoice.amount_due ?? 0)}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold text-sm">Arrears</span>
          <ul className="ml-6 col-span-2">
            {invoice.arrears?.length !== 0 ? (
              invoice.arrears?.map((arrear, index) => (
                <li key={index} className="text-sm grid grid-cols-2">
                  <span>{arrear.invoice_number}</span>
                  <span className="text-end">
                    &#8369; {formatNumber(arrear.amount_due ?? 0)}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm grid grid-cols-2">
                <span className="text-sm">N/A</span>
              </li>
            )}
          </ul>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold text-sm">Total Amount Due</span>
          <span className="text-end text-sm">
            &#8369; {formatNumber(total_amount_due)}
          </span>
        </div>
        <div className="grid grid-cols-2 mt-4">
          <span className="font-semibold text-sm">Due Date</span>
          <span className="text-end text-sm">
            {dayjs(invoice.due_date).format("MMMM D, YYYY")}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold text-sm">
            Total Amount after Due Date ( includes 10% surcharge )
          </span>
          <span className="text-end text-sm">
            &#8369;{" "}
            {`( ${formatNumber(total_amount_due)} + ${formatNumber(surcharge)} ) ${formatNumber(Number(total_amount_due) + Number(surcharge))} `}
          </span>
        </div>
      </div>
      {/* QR Code section */}
      <div className="flex mt-4">
        <span className="grow flex flex-col gap-2">
          <span className="font-semibold text-xs">
            * This not an official receipt.
          </span>
        </span>
        <span className="">
          <QRCode size={96} value={`${VITE_BASE_URL}/invoice/${invoice.id}`} />
        </span>
      </div>
    </div>
  );
}
