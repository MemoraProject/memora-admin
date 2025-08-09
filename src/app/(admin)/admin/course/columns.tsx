import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Course } from "@/models/course";
import Link from "next/link";

export const columns: (ColumnDef<Course> & {
  show?: boolean;
  accessorKey?: string;
})[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/admin/course/${row.original.id}`}
        className="text-blue-600 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="max-w-[360px] truncate"
        title={row.original.description || undefined}
      >
        {row.original.description || "-"}
      </div>
    ),
  },
  {
    accessorKey: "imgUrl",
    header: "Image URL",
    cell: ({ row }) => row.original.imgUrl || "-",
  },
  {
    accessorKey: "videoUrl",
    header: "Video URL",
    cell: ({ row }) => row.original.videoUrl || "-",
  },
  {
    accessorKey: "difficultLevel",
    header: "Level",
    cell: ({ row }) => row.original.difficultLevel || "-",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }).format(price);
      } catch {
        return price;
      }
    },
  },
  {
    accessorKey: "isPublic",
    header: "Public",
    cell: ({ row }) => (row.original.isPublic ? "Yes" : "No"),
  },
  {
    accessorKey: "identitfier",
    header: "Identifier",
    cell: ({ row }) => row.original.identitfier || "-",
  },
  {
    accessorKey: "totalChapter",
    header: "Chapters",
  },
  {
    accessorKey: "totalLesson",
    header: "Lessons",
  },
  {
    accessorKey: "processing",
    header: "Processing",
    cell: ({ row }) => `${row.original.processing}%`,
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => {
      const date = row.original.dateCreated;
      return date ? (
        <div>{moment(date).format("MMMM Do YYYY")}</div>
      ) : (
        <div>-</div>
      );
    },
  },
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => {
      const date = row.original.dateModified;
      return date ? (
        <div>{moment(date).format("MMMM Do YYYY")}</div>
      ) : (
        <div>-</div>
      );
    },
  },
];
