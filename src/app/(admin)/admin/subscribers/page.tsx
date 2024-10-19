"use client";

import React, { useEffect, useState } from "react";
import DataTableSkeleton from "@/components/dataTableSkelenton";
import { columns } from "./columns";
import { DataTable } from "../account/data-table";
import {
  deleteSubscriptionPlan,
  getAllSubscriptionPlans,
} from "@/api/subscriptionPlan";
import { toast } from "@/hooks/use-toast";
import { UserSubscription } from "@/models/userSubscription";
import { getAllUserSubscriptions } from "@/api/userSubscription";

function UserSubscriptionsPage() {
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUserSubscriptions();
      setUserSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteSubscriptionPlan(id);
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully.",
      });
      fetchPlans(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete subscription plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscription plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-shade-1-100% text-shade-2-100% space-y-4 rounded-[8px] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscribers</h2>
          <p className="text-muted-foreground">
            Manage subscription plans...
            <button
              onClick={fetchPlans}
              className="ml-2 text-blue-500 hover:underline"
            >
              reset
            </button>
          </p>
        </div>
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable onDelete={handleDelete} columns={columns} data={userSubscriptions} />
      )}
    </div>
  );
}

export default UserSubscriptionsPage;
