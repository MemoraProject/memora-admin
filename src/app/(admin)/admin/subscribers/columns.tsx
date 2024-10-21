import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { deleteSubscriptionPlan } from "@/api/subscriptionPlan";
import { UserSubscription } from "@/models/userSubscription";

export const columns: ColumnDef<UserSubscription>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "subscriptionPlanName",
    header: "Plan Name",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.getValue("dateCreated") as string;
      const formatted = moment(date).format("DD/MM/YYYY");
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("dateCreated") as string;
      const formatted = moment(date).format("DD/MM/YYYY");
      return <div>{formatted}</div>;
    },
  },

  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => {
      const date = row.getValue("dateCreated") as string;
      const formatted = moment(date).format("DD/MM/YYYY");
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => {
      const date = row.getValue("dateModified") as string;
      const formatted = moment(date).format("DD/MM/YYYY");
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const plan = row.original;
      const { toast } = useToast();
      const handleDelete = async () => {
        try {
          console.log(plan.id);
          await deleteSubscriptionPlan(plan.id);
          toast({
            title: "Subscription plan deleted",
            description: `Plan has been deleted successfully.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the subscription plan.",
            variant: "destructive",
          });
        }
      };
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(plan.id.toString())}
            >
              Copy plan ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit plan</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
