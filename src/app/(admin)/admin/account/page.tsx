"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/dataTableSkelenton";
import { UserWithActivityStatus } from "@/models/user";
import { deleteUser, getUsersWithActivityStatus } from "@/api/user";
import { toast } from "@/hooks/use-toast";

function AccountTablePage() {
  const [users, setUsers] = useState<UserWithActivityStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubscriptionFilter, setHasSubscriptionFilter] = useState<
    boolean | undefined
  >(undefined);
  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getUsersWithActivityStatus({});
      console.log(result);
      setUsers(result);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (userId: number) => {
    router.push(`/admin/account/${userId}`);
  };

  // Filter users based on subscription status
  const filteredUsers = useMemo(() => {
    if (hasSubscriptionFilter === undefined) {
      return users;
    }

    return users.filter((user) => {
      const hasSubscription =
        user.revenueCatDetails?.hasActiveSubscription || false;
      return hasSubscriptionFilter ? hasSubscription : !hasSubscription;
    });
  }, [users, hasSubscriptionFilter]);

  return (
    <div className="bg-shade-1-100% text-shade-2-100% space-y-4 rounded-[8px] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage all users in the system...
            <button
              onClick={fetchUsers}
              className="ml-2 text-blue-500 hover:underline"
            >
              refresh
            </button>
          </p>
        </div>
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable
          onDelete={handleDelete}
          onRowClick={handleRowClick}
          columns={columns}
          data={filteredUsers}
          hasSubscriptionFilter={hasSubscriptionFilter}
          setHasSubscriptionFilter={setHasSubscriptionFilter}
        />
      )}
    </div>
  );
}

export default AccountTablePage;
