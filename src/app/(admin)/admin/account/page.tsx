"use client"

import React, { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import DataTableSkeleton from "@/components/dataTableSkelenton"
import { User } from "@/models/user"
import { deleteUser, getAllUsers } from "@/api/user"
import { toast } from "@/hooks/use-toast"

function AccountTablePage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id)
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
      fetchUsers() // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage all users in the system...
            <button onClick={fetchUsers} className="ml-2 text-blue-500 hover:underline">refresh</button>
          </p>
        </div>
        {/* <CreateUserModal onSuccess={fetchUsers} /> */}
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable
          onDelete={handleDelete}
          columns={columns} 
          data={users}
        />
      )}
    </div>
  )
}

export default AccountTablePage