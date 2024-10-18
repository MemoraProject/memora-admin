"use client"

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/dataTableSkelenton";
import fakeData from './data.json';

function AccountTablePage() {
  const [itemList, setItemList] = useState(fakeData);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = () => {
    // Giả lập việc tải lại dữ liệu
    setIsLoading(true);
    setTimeout(() => {
      setItemList(fakeData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage all user in the system...
            <button onClick={refetch} className="ml-2 text-blue-500 hover:underline">reset</button>
          </p>
        </div>
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable columns={columns} data={itemList} />
      )}
    </div>
  );
}

export default AccountTablePage;
