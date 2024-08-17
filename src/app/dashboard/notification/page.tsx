import React from "react";
import prisma from "@/app/lib/db";
import { auth } from "@/auth";
import { getUserByEmail } from "@/app/api/auth/data";
import NotificationList from "./NotificationList";


const NotificationsPage = async () => { 
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  const notifications = await fetchNotifications(user?.id);

  return (
    <div>
      <h1 className="text-primary text-2xl max-w-4xl  m-auto py-8">Notifications</h1>
      <NotificationList notifications={notifications} />
    </div>
  );
};

export const fetchNotifications = async (userId: string | undefined) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export default NotificationsPage;