import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "@/models/payment"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import moment from 'moment'
import { useToast } from "@/hooks/use-toast"
import { deletePayment } from "@/api/payment"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => {
        const date = row.getValue("paymentDate") as string
        const formatted = moment(date).format('MMMM Do YYYY, h:mm:ss a')
        return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => {
        const date = row.getValue("dateCreated") as string
        const formatted = moment(date).format('MMMM Do YYYY, h:mm:ss a')
        return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "Processing" ? "secondary" : "default"}
          className={status !== "Processing" ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "userSubscription",
    header: "User Subscription",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      const { toast } = useToast()
      const handleDelete = async () => {
        try {
          await deletePayment(payment.id)
          toast({
            title: "Payment deleted",
            description: `Payment ID "${payment.id}" has been deleted successfully.`,
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the payment.",
            variant: "destructive",
          })
        }
      }
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id.toString())}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]