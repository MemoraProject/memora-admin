"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../components/table/data-table-view-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  hasSubscriptionFilter: boolean | undefined;
  setHasSubscriptionFilter: (value: boolean | undefined) => void;
}

export function DataTableToolbar<TData>({
  table,
  hasSubscriptionFilter,
  setHasSubscriptionFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    hasSubscriptionFilter !== undefined;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                setHasSubscriptionFilter(undefined);
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset Filters
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>

      <div className="flex flex-wrap gap-2">
        <div>
          <Select
            value={
              hasSubscriptionFilter === undefined
                ? "all"
                : hasSubscriptionFilter
                  ? "true"
                  : "false"
            }
            onValueChange={(value) => {
              if (value === "all") {
                setHasSubscriptionFilter(undefined);
              } else {
                setHasSubscriptionFilter(value === "true");
              }
            }}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Subscription Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="true">With Subscription</SelectItem>
              <SelectItem value="false">Without Subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
