"use client";
import useSWR from "swr";
import TanStackTable, { RowActions } from "@/components/Data-table";
import { apiClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { format, setDate } from "date-fns";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface Iheads {
  label: string;
  id: string;
}

const fetcher = (url: string) => apiClient.get(url)?.then((d) => d.data);

export const Submissions = () => {
  const { formId } = useParams();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const {
    data: submissionData,
    error,
    isLoading,
  } = useSWR(
    () =>
      `/api/response/form/${formId}?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`,
    fetcher,
  );

  const [tableData, setTableData] = useState<any[]>();
  const [totalPages, setTotalPages] = useState(0);
  const [columns, setColumns] = useState<ColumnDef<Iheads>[]>([]);

  useEffect(() => {
    if (!submissionData) return;
    const responses = submissionData.responses;
    const heads: Iheads[] = responses?.headers;
    if (!heads) return;

    const columnArr: ColumnDef<Iheads>[] = heads?.map((h) => {
      return {
        id: h?.id,
        header: h?.label,
        accessorKey: h?.id,
        cell: ({ row }) => {
          // @ts-ignore
          const value = row.getValue(h?.id)?.value;
          const dateSchema = z.iso.datetime();
          const imgUrlSchema = z.httpUrl({
            pattern:
              /^https:\/\/bucket\.planetform\.xyz\/[\w\-\.\/]+\.(jpg|jpeg|png|gif|webp|svg)$/i,
          });
          const parsed = dateSchema.safeParse(value);
          const parsedImg = imgUrlSchema.safeParse(value);

          if (parsed.success) {
            const date = new Date(parsed.data);
            return <div className="font-medium ">{format(date, "Pp")}</div>;
          }
          if (parsedImg.success) {
            return (
              <div className="font-medium flex ">
                <Image
                  className=""
                  width={80}
                  height={80}
                  src={parsedImg.data}
                  alt="uploaded-img"
                />
                <a href={parsedImg.data} download>
                  <svg
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
            <div className="font-medium ">
              {/* @ts-ignore */}
              <p className=" text-wrap">{row.getValue(h?.id)?.value}</p>
            </div>
          );
        },

        size: 200,
        enableHiding: true,
      };
    });

    columnArr?.unshift({
      id: "select",
      header: ({ table }) => (
        <div className=" grid place-content-center mr-1">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
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
      size: 46,
      enableSorting: false,
      enableHiding: false,
    });

    columnArr?.push({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 60,
      enableHiding: false,
    });

    setColumns(columnArr);
    setTotalPages(responses?.totalPages);
    setTableData(responses?.res);
  }, [submissionData, pagination]);

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center gap-4">
        <span>
          <TriangleAlert className=" text-destructive" />
        </span>
        <p>failed to get form submissions</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <TanStackTable
        states={{ pagination, setPagination, pageCount: totalPages }}
        columns={columns || []}
        formId={formId as string}
        data={tableData || []}
        setData={setTableData}
      />
    </>
  );
};
