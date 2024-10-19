import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/models/user";
import moment from "moment";

export const columns: (ColumnDef<User> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
          {row.original.id}
        </h3>
      </div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
          {row.original.fullName || "-"}
        </h3>
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: "Username",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
          {row.original.userName || "-"}
        </h3>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
          {row.original.email}
        </h3>
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
          {row.original.phoneNumber}
        </h3>
      </div>
    ),
  },
  
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      const formatted = moment(date).format('MMMM Do YYYY')
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Date Modified",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string
      const formatted = moment(date).format('MMMM Do YYYY')
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "deletedAt",
    header: "Deleted At",
    cell: ({ row }) => {
      const date = row.getValue("deletedAt") as string | null
      return <div>{date ? moment(date).format('MMMM Do YYYY') : '-'}</div>
    },
  },
];