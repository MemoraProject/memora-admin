"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DetailInformation from "./detail-information";
import { User } from "@/models/user";
import { getUserById } from "@/api/user";
import { toast } from "@/hooks/use-toast";

function AccountDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(false)

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const data = await getUserById(params.id)
      setUser(data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [params.id])

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">User Detail Information</h1>
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="h-20 w-20">
          <AvatarImage src={user?.profilePicture || undefined} alt={user?.fullName || ''} />
            <AvatarFallback>{user?.fullName?.[0] || ''}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user?.fullName}</CardTitle>
            <p className="text-sm text-gray-500">User Information</p>
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