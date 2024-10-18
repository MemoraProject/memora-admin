import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

type UserItem = {
  Id: string;
  FirstName: string;
  LastName: string;
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
    accessorKey: "name",
    header: "Name",
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
    accessorKey: "ProfilePicture",
    header: "Ảnh đại diện",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="h-[48px] w-[48px]">
          <Image
            src={`https://via.placeholder.com/48x48?text=${user.FirstName.charAt(0)}`}
            alt={user.FullName}
            width={48}
            height={48}
            className="object-cover rounded-full"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "DateCreated",
    header: "Ngày tạo",
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
    header: "Ngày sửa đổi",
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
    header: "Người tạo",
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
    header: "Trạng thái",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <p className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {user.DeletedAt ? "Đã xóa" : "Hoạt động"}
          </p>
        </div>
      );
    },
  },
];
