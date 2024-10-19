import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DetailInformation from "./DetailInformation";
import { User } from "@/models/user";

function AccountDetailPage({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">User Detail Information</h1>
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture || undefined} alt={user.fullName || ''} />
            <AvatarFallback>{user.fullName?.[0] || ''}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.fullName}</CardTitle>
            <p className="text-sm text-gray-500">user Information</p>
          </div>
        </CardHeader>
        <CardContent>
          <DetailInformation user={user} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AccountDetailPage;