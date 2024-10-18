import { ColumnDef } from "@tanstack/react-table";

type UserItem = {
  Id: string;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  ProfilePicture: string;
  FullName: string;
  DateCreated: string;
  DateModified: string;
  DeletedAt: string | null;
  CreatedBy: string;
  ModifiedBy: string;
};

export const columns: (ColumnDef<UserItem> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "Id",
    header: "Id",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.Id}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "FullName",
    header: "Fullname",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.FullName}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "UserName",
    header: "Username",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.UserName}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.Email}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "PhoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {  
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.PhoneNumber}
          </h3>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "ProfilePicture",
  //   header: "Profile Picture",
  //   cell: ({ row }) => {
  //     const user = row.original;
  //     return (
  //       <div className="h-[48px] w-[48px]">
  //         <Image
  //           src={`https://via.placeholder.com/48x48?text=${user.FirstName.charAt(0)}`}
  //           alt={user.FullName}
  //           width={48}
  //           height={48}
  //           className="object-cover rounded-full"
  //         />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "DateCreated",
    header: "Date Created",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {new Date(user.DateCreated).toLocaleDateString('vi-VN')}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "DateModified",
    header: "Date Modified",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {new Date(user.DateModified).toLocaleDateString('vi-VN')}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "CreatedBy",
    header: "Created By",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.CreatedBy}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "DeletedAt",
    header: "Deleted At",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.DeletedAt}
          </p>
        </div>
      );
    },
  },
];
