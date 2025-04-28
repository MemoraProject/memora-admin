import { ColumnDef } from "@tanstack/react-table";
import { User, UserWithActivityStatus } from "@/models/user";
import moment from "moment";

export const columns: (ColumnDef<UserWithActivityStatus> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h3 className="text-neutral-8 whitespace-nowrap text-[14px] not-italic leading-[normal]">
          {row.original.email}
        </h3>
      </div>
    ),
  },
  {
    accessorKey: "activityStatus",
    header: "Activity Status",
    cell: ({ row }) => {
      const status = row.original.activityStatus;
      const map: any = {
        green: {
          color: "bg-green-500",
          text: "Recent",
        },
        yellow: {
          color: "bg-yellow-500",
          text: "Last 24h",
        },
        orange: {
          color: "bg-orange-500",
          text: "Last 3 days",
        },
        gray: {
          color: "bg-gray-400",
          text: "Over 30 days",
        },
      };

      return (
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${map[status].color}`}></div>
          <span className="capitalize">{map[status].text}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastSeenAt",
    header: "Last Seen",
    cell: ({ row }) => {
      const date = row.getValue("lastSeenAt") as string;
      return date ? (
        <div>{moment(date).format("MMMM Do YYYY")}</div>
      ) : (
        <div>-</div>
      );
    },
  },
  // {
  //   accessorKey: "phoneNumber",
  //   header: "Phone Number",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //       <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
  //         {row.original.phoneNumber}
  //       </h3>
  //     </div>
  //   ),
  // },

  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = moment(date).format("MMMM Do YYYY");
      return <div>{formatted}</div>;
    },
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Date Modified",
  //   cell: ({ row }) => {
  //     const date = row.getValue("updatedAt") as string
  //     const formatted = moment(date).format('MMMM Do YYYY')
  //     return <div>{formatted}</div>
  //   },
  // },
  // {
  //   accessorKey: "deletedAt",
  //   header: "Deleted At",
  //   cell: ({ row }) => {
  //     const date = row.getValue("deletedAt") as string | null
  //     return <div>{date ? moment(date).format('MMMM Do YYYY') : '-'}</div>
  //   },
  // },
];
