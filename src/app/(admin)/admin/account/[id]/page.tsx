"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DetailInformation from "./detail-information";
import { User } from "@/models/user";
import { getUserWithFullDetails } from "@/api/user";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

function AccountDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const data = await getUserWithFullDetails(params.id);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {/* Go Back */}
        </button>
        <h1 className="text-2xl font-bold">Customer Profile</h1>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !user ? (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            User not found
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The user you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.profilePicture || undefined}
                  alt={user?.fullName || ""}
                />
                <AvatarFallback>{user?.fullName?.[0] || ""}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.fullName}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <DetailInformation user={user} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountDetailPage;
