"use server"

import prisma from "@/app/lib/db";
export const markNotificationAsRead = async (notificationId: string) => {
    try {
      await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          isRead: true,
        },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  