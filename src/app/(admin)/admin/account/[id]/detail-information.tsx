import { User } from "@/models/user";

function DetailInformation({ user }: { user: User | undefined }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="User Id" value={user?.id} />
          <InfoItem label="Username" value={user?.userName || ''} />
          <InfoItem label="Full Name" value={user?.fullName || ''} fullWidth/>
          <InfoItem label="Email" value={user?.email || ''} isEmail />
          <InfoItem label="Phone Number" value={user?.phoneNumber || ''} />
          <InfoItem label="Date Created At" value={user?.dateCreated || ''} />
          <InfoItem label="Create By" value={user?.createdBy || ''} />
          <InfoItem label="Date Modified" value={user?.dateModified || ''} />
          <InfoItem label="Modified By" value={user?.modifiedBy || ''} />
          <InfoItem label="Date Deleted" value={user?.deletedAt || ''} fullWidth />
      </div>
    )
}

function InfoItem({ label, value, isEmail = false, fullWidth = false }: { label: string, value: string | number | undefined, isEmail?: boolean, fullWidth?: boolean }) {
    return (
      <div className={`bg-[#fbfcfc] p-4 rounded-lg shadow ${fullWidth ? 'col-span-full' : ''}`}>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className={`text-lg font-semibold ${isEmail ? 'text-blue-600 hover:underline' : 'text-gray-800'}`}>
          {isEmail ? <a href={`mailto:${value}`}>{value}</a> : value}
        </p>
      </div>
    )
}

export default DetailInformation;