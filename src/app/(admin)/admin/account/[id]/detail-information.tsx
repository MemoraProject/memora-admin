import { User } from "@/models/user";
import { formatDate } from "@/lib/utils";

function DetailInformation({ user }: { user: User | undefined }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-medium">Customer Details</h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <TableRow label="User Id" value={user?.id} />
                <TableRow label="Username" value={user?.userName || ""} />
                <TableRow label="Full Name" value={user?.fullName || ""} />
                <TableRow label="Email" value={user?.email || ""} isEmail />
                <TableRow
                  label="Phone Number"
                  value={user?.phoneNumber || ""}
                />
                {user?.revenueCatDetails && (
                  <>
                    <TableRow
                      label="Last Opened"
                      value={formatDate(user.revenueCatDetails.lastOpened)}
                    />
                    <TableRow
                      label="User Since"
                      value={formatDate(user.revenueCatDetails.userSince)}
                    />
                    <TableRow
                      label="Total Spent"
                      value={`${user.revenueCatDetails.currency} ${user.revenueCatDetails.totalSpent.toFixed(2)}`}
                    />
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {user?.revenueCatDetails && (
        <>
          {/* <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-lg font-medium">Customer App Usage</h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}

          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-lg font-medium">Subscription Status</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
              <InfoItem
                label="Active Subscription"
                value={
                  user.revenueCatDetails.hasActiveSubscription ? "Yes" : "No"
                }
                className={
                  user.revenueCatDetails.hasActiveSubscription
                    ? "text-green-600"
                    : "text-red-600"
                }
              />
              <InfoItem
                label="Active Entitlements"
                value={user.revenueCatDetails.activeEntitlements.toString()}
              />
              {user.revenueCatDetails.managementUrl && (
                <InfoItem
                  label="Subscription Management"
                  value={user.revenueCatDetails.managementUrl}
                  isLink
                  fullWidth
                />
              )}
              {user.revenueCatDetails.entitlementIdentifiers &&
                user.revenueCatDetails.entitlementIdentifiers.length > 0 && (
                  <div className="col-span-full rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Entitlement IDs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.revenueCatDetails.entitlementIdentifiers.map(
                        (id, index) => (
                          <span
                            key={index}
                            className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          >
                            {id}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {user.revenueCatDetails.allAliases &&
            user.revenueCatDetails.allAliases.length > 0 && (
              <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="text-lg font-medium">Customer Aliases</h3>
                </div>
                <div className="p-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      All Aliases
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.revenueCatDetails.allAliases.map((alias, index) => (
                        <span
                          key={index}
                          className="rounded bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {user.revenueCatDetails.attributes &&
            Object.keys(user.revenueCatDetails.attributes).length > 0 && (
              <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="text-lg font-medium">Customer Attributes</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {Object.entries(user.revenueCatDetails.attributes).map(
                      ([key, value], index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                        >
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {key}
                          </p>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {value}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-lg font-medium">Customer History</h3>
            </div>
            <div className="p-4">
              {user.revenueCatDetails.subscriptionHistory &&
              user.revenueCatDetails.subscriptionHistory.length > 0 ? (
                <div className="space-y-4">
                  {user.revenueCatDetails.subscriptionHistory.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                      >
                        <div className="mr-4">
                          {item.type === "INITIAL_PURCHASE" ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                              <span className="text-green-500 dark:text-green-300">
                                $
                              </span>
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                              <span className="text-blue-500 dark:text-blue-300">
                                ⟳
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(item.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{`${item.currency} ${item.amount.toFixed(2)}`}</p>
                          <p className="text-sm text-gray-500">
                            {item.productIdentifier}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No subscription history available
                </p>
              )}
            </div>
          </div>
        </>
      )}
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
