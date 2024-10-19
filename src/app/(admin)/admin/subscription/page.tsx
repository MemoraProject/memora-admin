"use client"

import React, { useEffect, useState } from "react"
import DataTableSkeleton from "@/components/dataTableSkelenton"
import { SubscriptionPlan } from "@/models/subscriptionPlan"
import { columns } from "./columns"
import { DataTable } from "../account/data-table"
import { deleteSubscriptionPlan, getAllSubscriptionPlans } from "@/api/subscriptionPlan"
import { toast } from "@/hooks/use-toast"
import { CreateSubscriptionModal } from "./create-subscription-modal"

function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPlans = async () => {
    setIsLoading(true)
    try {
      const data = await getAllSubscriptionPlans()
      setPlans(data)
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error)
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteSubscriptionPlan(id)
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully.",
      })
      fetchPlans() // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete subscription plan:", error)
      toast({
        title: "Error",
        description: "Failed to delete subscription plan. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 text-shade-2-100%">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground">
            Manage subscription plans...
            <button onClick={fetchPlans} className="ml-2 text-blue-500 hover:underline">reset</button>
          </p>
        </div>
        <CreateSubscriptionModal onSuccess={fetchPlans} />
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable
          onDelete={handleDelete}
          columns={columns} 
          data={plans}
        />
      )}
    </div>
  )
}

export default SubscriptionPlansPage