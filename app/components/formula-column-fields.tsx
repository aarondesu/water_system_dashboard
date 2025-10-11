import { formulaSchema, formulaTableColumn } from "~/schemas";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatNumber } from "~/lib/utils";
import { Button } from "./ui/button";
import { Ban, GripVertical, InfoIcon, Minus, Plus } from "lucide-react";
import { FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { useCallback, useMemo, useState } from "react";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { evaluate } from "~/lib/mathjs";

type TableColumn = {
  header: string;
  value: string;
};

interface FormulaColumnFieldsProps {
  result: string;
  isLoading: boolean;
  mode: "create" | "edit";
}

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id: id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      type="button"
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVertical className="size-5" />
    </Button>
  );
}

function DraggableRow({
  index,
  column,
  removeColumn,
  cancelRemoval,
}: {
  index: number;
  column: z.infer<typeof formulaTableColumn>;
  removeColumn: () => void;
  cancelRemoval: () => void;
}) {
  const form = useFormContext<z.infer<typeof formulaSchema>>();
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: index,
  });

  return (
    <TableRow
      key={index}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <TableCell className="w-fit">
        <DragHandle id={index} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="pt-5">
            {column.delete ? (
              <Button
                size="icon"
                className="w-6 h-6"
                variant="outline"
                type="button"
                disabled={column.isStatic}
                onClick={cancelRemoval}
              >
                <Ban />
              </Button>
            ) : (
              <Button
                size="icon"
                className="w-6 h-6"
                variant="outline"
                type="button"
                disabled={column.isStatic}
                onClick={removeColumn}
              >
                <Minus />
              </Button>
            )}
          </div>
          <FormField
            control={form.control}
            name={`columns.${index}.header`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Header</FormLabel>
                <Input
                  disabled={column.isStatic}
                  {...form.register(`columns.${index}.header`)}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`columns.${index}.value`}
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Value</FormLabel>
                <Input
                  disabled={column.isStatic}
                  {...form.register(`columns.${index}.value`)}
                />
              </FormItem>
            )}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function FormulaColumnFields({
  result,
  isLoading,
  mode,
}: FormulaColumnFieldsProps) {
  const form = useFormContext<z.infer<typeof formulaSchema>>();
  const [tableData, setTableData] = useState<TableColumn[]>([]);

  const watchedVariables = useWatch({
    control: form.control,
    name: "variables",
  });
  const watchedColumns = useWatch({
    control: form.control,
    name: "columns",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const columnIds = useMemo(
    () => watchedColumns.map((col, index) => index),
    [watchedColumns]
  );

  const variables = useMemo(() => {
    return (watchedVariables ?? []).reduce<Record<string, number>>(
      (acc, item) => {
        if (item.delete === true) return acc;

        acc[item.name] = Number(item.value);

        return acc;
      },
      {}
    );
  }, [watchedVariables]);

  const addNewColumn = useCallback(() => {
    const columns = form.getValues("columns");
    columns.push({
      header: "",
      value: "",
    });

    form.setValue("columns", columns);
  }, [form]);

  const removeColumn = useCallback(
    (id: number) => {
      const columns = form.getValues("columns");

      if (mode === "create") {
        delete columns[id];

        form.setValue("columns", columns);
      } else {
        // Check if ID exists, if it exists mark for deletion, if not remove it from list
        if (columns[id].id) {
          columns[id].delete = true;
        } else {
          delete columns[id];
        }
      }

      form.setValue("columns", columns);
    },
    [form]
  );

  const cancelRemoval = useCallback(
    (id: number) => {
      if (mode === "edit") {
        const columns = form.getValues("columns");
        columns[id].delete = false;

        form.setValue("columns", columns);
      }
    },
    [form]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = columnIds.indexOf(Number(active.id));
        const newIndex = columnIds.indexOf(Number(over.id));

        form.setValue("columns", arrayMove(watchedColumns, oldIndex, newIndex));
      }
    },
    [watchedColumns]
  );

  const onTableUpdate = useCallback(() => {
    setTableData([]);
    const columns = form.getValues("columns");

    columns.map((col) => {
      const evaluatedValue = evaluate(col.value, variables);

      setTableData((prev) => [
        ...prev,
        {
          header: col.header,
          value: evaluatedValue,
        },
      ]);
    });
  }, []);

  return (
    <div className="space-y-4">
      <span>
        <h3 className="font-bold text-xl">Formula Data Table</h3>
        <p className="text-muted-foreground text-sm">
          Displays information on invoice on how the formula is computed
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <div className="flex gap-2 items-center justify-between">
              <h4 className="font-bold text-lg">Table Preview</h4>
              <Button type="button" variant="outline" onClick={onTableUpdate}>
                Update
              </Button>
            </div>
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableData.map((column, index) => (
                      <TableHead key={index}>{column.header}</TableHead>
                    ))}
                    <TableHead>Amount Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {tableData.map((column, index) => {
                      return (
                        <TableCell key={index}>
                          {formatNumber(Number(column.value))}
                        </TableCell>
                      );
                    })}
                    <TableCell>{formatNumber(Number(result))}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg">Table Columns</h4>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="w-8 h-8"
                onClick={addNewColumn}
                disabled={isLoading}
              >
                <Plus />
              </Button>
            </div>
            <Alert>
              <InfoIcon />
              <AlertDescription>
                You can use mathematical expressions in the "Value" field. For
                example, enter `a + b * 2` to calculate using variables defined
                above. Supported operators: +, -, *, /, ^, parentheses, min,
                max, and variables.
              </AlertDescription>
            </Alert>
            <Alert>
              <InfoIcon />
              <AlertDescription>
                Reorder the column order by dragging the rows to the desired
                position
              </AlertDescription>
            </Alert>
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
              onDragEnd={onDragEnd}
            >
              <Table>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {form.watch("columns").map((column, index) => (
                    <SortableContext
                      key={index}
                      items={columnIds}
                      strategy={verticalListSortingStrategy}
                    >
                      <DraggableRow
                        removeColumn={() => removeColumn(index)}
                        cancelRemoval={() => cancelRemoval(index)}
                        index={index}
                        column={column}
                      />
                    </SortableContext>
                  ))}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </div>
      </span>
    </div>
  );
}
