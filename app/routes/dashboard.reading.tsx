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

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await store
    .dispatch(
      readingApi.endpoints.getAllReadings.initiate({
        page_index: 1,
        rows: 10,
      })
    )
    .unwrap()
    .then((data) => data)
    .catch((error) => {
      console.log(error);
      return undefined;
    });
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus /> Create new reading
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[1000px] md:min-w-[1000px]">
            <DialogHeader>
              <DialogTitle>Create new Reading</DialogTitle>
            </DialogHeader>
            <CreateReadingsForm
              onCreateSuccess={() => setOpen((open) => false)}
            />
          </DialogContent>
        </Dialog>
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
