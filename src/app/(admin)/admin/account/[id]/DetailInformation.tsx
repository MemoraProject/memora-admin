import { User } from "@/models/user";

function DetailInformation({ user }: { user: User }) {
    return (
        <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-sm font-medium text-gray-500">User Id</p>
      <p className="mt-1">{user.id}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">User Full Name</p>
      <p className="mt-1">{user.fullName}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Username</p>
      <p className="mt-1">{user.userName}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Email</p>
      <p className="mt-1 text-blue-600">{user.email}</p>
    </div>
    <div className="col-span-2">
      <p className="text-sm font-medium text-gray-500">Phone Number</p>
      <p className="mt-1">{user.phoneNumber}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Date Created At</p>
      <p className="mt-1 text-blue-600">{user.dateCreated}</p>
    </div>
  </div>
    )
}

export default DetailInformation;