import { Course } from "@/models/course";
import { formatDate } from "@/lib/utils";

function DetailInformation({ course }: { course: Course | undefined }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-medium">Course Details</h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <TableRow label="Course Id" value={course?.id} />
                <TableRow label="Title" value={course?.title || ""} />
                <TableRow
                  label="Identifier"
                  value={course?.identitfier || ""}
                />
                <TableRow
                  label="Public"
                  value={course?.isPublic ? "Yes" : "No"}
                />
                <TableRow label="Created By" value={course?.createdBy || ""} />
                <TableRow
                  label="Date Created"
                  value={formatDate(course?.dateCreated)}
                />
                <TableRow
                  label="Date Modified"
                  value={formatDate(course?.dateModified)}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({
  label,
  value,
  isEmail = false,
  isLink = false,
  className = "",
}: {
  label: string;
  value: string | number | undefined;
  isEmail?: boolean;
  isLink?: boolean;
  className?: string;
}) {
  if (value === undefined || value === null || value === "") {
    value = "-";
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="w-1/3 py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">
        {label}
      </td>
      <td className={`py-3 ${className || "text-gray-800 dark:text-gray-200"}`}>
        {isEmail && value !== "-" ? (
          <a
            href={`mailto:${value}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {value}
          </a>
        ) : isLink && value !== "-" ? (
          <a
            href={value.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </td>
    </tr>
  );
}

function InfoItem({
  label,
  value,
  isEmail = false,
  isLink = false,
  fullWidth = false,
  className = "",
}: {
  label: string;
  value: string | number | undefined;
  isEmail?: boolean;
  isLink?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  if (value === undefined || value === null || value === "") {
    value = "-";
  }

  return (
    <div
      className={`rounded-lg bg-gray-50 p-4 dark:bg-gray-700 ${fullWidth ? "col-span-full" : ""}`}
    >
      <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p
        className={`text-md font-semibold ${isEmail ? "text-blue-600 hover:underline dark:text-blue-400" : ""} ${isLink ? "text-blue-600 hover:underline dark:text-blue-400" : ""} ${className || "text-gray-800 dark:text-gray-200"}`}
      >
        {isEmail && value !== "-" ? (
          <a href={`mailto:${value}`}>{value}</a>
        ) : isLink && value !== "-" ? (
          <a href={value.toString()} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

export default DetailInformation;
