"use client";

import React, { useEffect, useState } from "react";
import DataTableSkeleton from "@/components/dataTableSkelenton";
import { Payment } from "@/models/payment";
import { columns } from "./columns";
import { DataTable } from "../account/data-table";
import { deletePayment, getAllPayments } from "@/api/payment";
import { toast } from "@/hooks/use-toast";
import { CreatePaymentModal } from "./create-payment-modal";

function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const rawdata = await getAllPayments();
      const data = rawdata.sort((a, b) => b.id - a.id);
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePayment(id);
      toast({
        title: "Success",
        description: "Payment deleted successfully.",
      });
      fetchPayments(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-shade-1-100% text-shade-2-100% space-y-4 rounded-[8px] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            Manage payments...
            <button
              onClick={fetchPayments}
              className="ml-2 text-blue-500 hover:underline"
            >
              refresh
            </button>
          </p>
        </div>
        <CreatePaymentModal onSuccess={fetchPayments} />
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable onDelete={handleDelete} columns={columns} data={payments} />
      )}
    </div>
  );
}

export default PaymentsPage;
