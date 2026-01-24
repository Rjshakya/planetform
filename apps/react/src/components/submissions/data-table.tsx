import { useCallback, useMemo, useState, type CSSProperties } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  EllipsisIcon,
  PinOffIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { mutate } from "swr";
import { getUseResponsesKey } from "@/hooks/use-responses";
import { z } from "zod";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { handleDeleteRespondent } from "@/lib/respondent";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export type RowValue = {
  [field: string]: {
    id: string;
    value: string;
    label: string;
  };
};

export type Header = {
  id: string;
  label: string;
};

const dateSchema = z.iso.datetime();
const imgUrlSchema = z.httpUrl({
  pattern:
    /^https:\/\/bucket\.planetform\.xyz\/[\w\-.]+\.(jpg|jpeg|png|gif|webp|svg)$/i,
});

const getPinningStyles = (column: Column<RowValue>): CSSProperties => {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export const SubmissionsComp = ({
  rows,
  pageCount: totalPages,
  formId,
  headers,
}: {
  rows: any[];
  pageCount: number;
  formId: string;
  headers: Header[];
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [pageCount] = useState(totalPages ?? 0);

  const columnDef = useMemo(() => {
    const columns: ColumnDef<Header>[] = headers.map((h) => {
      return {
        id: h?.id,
        accessorKey: h?.id,
        header: h?.label,

        cell: ({ row }) => {
          const value = row.getValue(h?.id) as {
            id: string;
            value: string;
          };

          const parsed = dateSchema.safeParse(value?.value);
          const parsedImg = imgUrlSchema.safeParse(value?.value);

          if (parsed.success) {
            const date = new Date(parsed.data);
            return (
              <div className="font-medium text-muted-foreground">
                {format(date, "ha PPP")}
              </div>
            );
          }

          if (parsedImg.success) {
            return (
              <div className="font-medium flex  gap-1 px-5">
                <img
                  className="w-full"
                  width={80}
                  height={80}
                  src={parsedImg.data}
                  alt="uploaded-img"
                />
                <a href={parsedImg.data} download>
                  <svg
                    role="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    className=" size-6 fill-green-500"
                    viewBox="0 0 24 24"
                    fill="#fff"
                  >
                    <path
                      opacity="0.4"
                      d="M2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.18C19.83 2 22 4.17 22 7.81V16.18C22 19.82 19.83 21.99 16.19 21.99H7.81C4.17 22 2 19.83 2 16.19Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M11.47 18.53L7.18 14.24C6.89 13.95 6.89 13.47 7.18 13.18C7.47 12.89 7.95 12.89 8.24 13.18L11.25 16.19V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V16.19L15.76 13.18C16.05 12.89 16.53 12.89 16.82 13.18C16.97 13.33 17.04 13.52 17.04 13.71C17.04 13.9 16.97 14.09 16.82 14.24L12.53 18.53C12.39 18.67 12.2 18.75 12 18.75C11.8 18.75 11.61 18.67 11.47 18.53Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </svg>
                </a>
              </div>
            );
          }

          return (
            <div className="w-full">
              <p className="text-wrap text-muted-foreground">{value?.value}</p>
            </div>
          );
        },
        size: 200,
        enableHiding: true,
      };
    });

    columns?.unshift({
      id: "select",
      header: ({ table }) => (
        <div className=" grid place-content-center mr-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && undefined)
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          className=" ml-1"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 50,
      enableHiding: false,
    });

    return columns;
  }, [headers]);

  return (
    <SubmissionDataTable
      data={rows}
      columns={columnDef}
      states={{ pagination, setPagination, formId, pageCount }}
    />
  );
};

export const SubmissionDataTable = ({
  columns,
  data,
  states,
}: {
  columns: ColumnDef<Header>[];
  data: any[];
  states: {
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    pageCount: number;
    formId: string;
  };
}) => {
  const { formId } = useParams()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: states?.pageCount ?? -1,
    enableSortingRemoval: false,
    onPaginationChange: states.setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
      columnVisibility,
      pagination: states.pagination,
    },
    columnResizeMode: "onChange",
  });

  const handleDeleteRows = useCallback(async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original?.id === item?.id)
    );
    const selectedRowsId = selectedRows.map((r) => r?.original?.id);
    await handleDeleteRespondent(selectedRowsId)
    table.resetRowSelection();
    mutate(
      `/api/response/form/${formId}?pageIndex=${states.pagination}&pageSize=${states.pageCount}`
    );
  }, [data, formId, states, table])

  return (
    <div className=" ">

      <div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger render={<Button className="ml-auto" variant="outline">
                <TrashIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Delete
                <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                  {table.getSelectedRowModel().rows.length}
                </span>
              </Button>} />
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div
        className="overflow-x-auto relative"
        style={{ scrollbarWidth: "thin" }}
      >
        <Table className="table-fixed ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  const isPinned = column.getIsPinned();

                  const isLastLeftPinned =
                    isPinned === "left" && column.getIsLastColumn("left");
                  const isFirstRightPinned =
                    isPinned === "right" && column.getIsFirstColumn("right");

                  return (
                    <TableHead
                      key={header.id}
                      // style={{ width: `${header.getSize()}px` }}
                      className="h-12 relative border-t select-none last:[&>.cursor-col-resize]:opacity-0 bg-muted"
                      colSpan={header.colSpan}
                      style={{
                        ...getPinningStyles(column),
                        width: `${header.getSize()}px`,
                      }}
                      data-pinned={isPinned || undefined}
                      data-last-col={
                        isLastLeftPinned
                          ? "left"
                          : isFirstRightPinned
                            ? "right"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          <div className=" flex items-center gap-1">
                            {{
                              asc: (
                                <ChevronUpIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ChevronDownIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                            {header.column.getIsPinned() ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="-mr-1 size-7 shadow-none"
                                onClick={() => header.column.pin(false)}
                                aria-label={`Unpin ${header.column.columnDef.header as string
                                  } column`}
                                title={`Unpin ${header.column.columnDef.header as string
                                  } column`}
                              >
                                <PinOffIcon
                                  className="opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="-mr-1 size-7 shadow-none"
                                      aria-label={`Pin options for ${header.column.columnDef.header as string
                                        } column`}
                                      title={`Pin options for ${header.column.columnDef.header as string
                                        } column`}
                                    >
                                      <EllipsisIcon
                                        className="opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    </Button>
                                  }
                                />

                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("left")}
                                  >
                                    <ArrowLeftToLineIcon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to left
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("right")}
                                  >
                                    <ArrowRightToLineIcon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to right
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          {header.column.getCanResize() && (
                            <div
                              {...{
                                onDoubleClick: () => header.column.resetSize(),
                                onMouseDown: header.getResizeHandler(),
                                onTouchStart: header.getResizeHandler(),
                                className:
                                  "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px",
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows?.map((row) => {
                return (
                  row?.original?.id && (
                    <TableRow
                      key={row?.original?.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const { column, row } = cell;
                        const isPinned = column.getIsPinned();
                        const isLastLeftPinned =
                          isPinned === "left" && column.getIsLastColumn("left");
                        const isFirstRightPinned =
                          isPinned === "right" &&
                          column.getIsFirstColumn("right");

                        return (
                          <TableCell
                            key={cell.id}
                            className=" [&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 truncate data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l border mx-8 p-3 align-middle"
                            style={{ ...getPinningStyles(column) }}
                            data-pinned={isPinned || undefined}
                            data-last-col={
                              isLastLeftPinned
                                ? "left"
                                : isFirstRightPinned
                                  ? "right"
                                  : undefined
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        {/* Page number information */}
        <div className="text-muted-foreground flex grow  text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="text-foreground">{table.getPageCount()}</span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={async () => {
                    mutate(
                      getUseResponsesKey({
                        formId: states.formId,
                        pageIndex: states.pagination.pageIndex,
                        pageSize: states.pagination.pageSize,
                      }),
                    );
                    table.previousPage();
                  }}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={async () => {
                    mutate(
                      getUseResponsesKey({
                        formId: states.formId,
                        pageIndex: states.pagination.pageIndex,
                        pageSize: states.pagination.pageSize,
                      }),
                    );
                    table.nextPage();
                  }}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
