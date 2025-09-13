import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import CreateReadingsForm from "~/components/forms/create-readings-form";
import ReadingsTable from "~/components/tables/readings-table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { Route } from "./+types/dashboard.reading";
import { store } from "~/redux/store";
import { readingApi, useGetAllReadingsQuery } from "~/redux/apis/readingApi";
import { type PaginationState } from "@tanstack/react-table";
import CreateMultipleReadingsForm from "~/components/forms/create-multiple-readings-form";
import CreateReadingDialog from "~/components/create-reading-dialog";
import CreateMultipleReadingDialog from "~/components/create-multiple-reading-dialog";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // Prefetch data
  await store.dispatch(
    readingApi.endpoints.getAllReadings.initiate({
      page_index: 1,
      rows: 10,
    })
  );

  await store.dispatch(
    readingApi.endpoints.getLatestReadingPerMeter.initiate()
  );
}

export function meta() {
  return [{ title: "Readings | Dashboard" }];
}

export default function ReadingPage({ loaderData }: Route.ComponentProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching, refetch } = useGetAllReadingsQuery({
    page_index: pagination.pageIndex + 1,
    rows: pagination.pageSize,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Readings</h2>
        <CreateReadingDialog />
        <CreateMultipleReadingDialog />
      </div>
      <div className="">
        <ReadingsTable
          pagination={pagination}
          setPagination={setPagination}
          data={data}
        />
      </div>
    </div>
  );
}
