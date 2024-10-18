import { ColumnDef } from "@tanstack/react-table"
import { SubscriptionPlan } from "@/models/subscriptionPlan"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import moment from 'moment'

export const columns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "durationUnit",
    header: "Duration Unit",
  },
  {
    accessorKey: "benefit",
    header: "Benefit",
  },
  
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => {
        const date = row.getValue("dateCreated") as string
        const formatted = moment(date).format('MMMM Do YYYY')
        return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => {
      const date = row.getValue("dateModified") as string
      const formatted = moment(date).format('MMMM Do YYYY')
      return <div>{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const plan = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(plan.id.toString())}>
              Copy plan ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit plan</DropdownMenuItem>
            <DropdownMenuItem>Delete plan</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]