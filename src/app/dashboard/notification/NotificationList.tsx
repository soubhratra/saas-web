"use client"
import React from "react";
import { formatDistanceToNow } from 'date-fns';
import { markNotificationAsRead } from "@/app/api/actions/mark";



interface NotificationProps {
  notifications: {
    id: string;
    message: string;
    createdAt: Date;
    isRead: boolean;
  }[];
}


const NotificationList: React.FC<NotificationProps> = ({ notifications }) => {
  const handleReadClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };
  return (
    <ul className="gap-y-4 font-thin">
    {notifications.length > 0 ? (
      notifications.filter((notification) => !notification.isRead).length > 0 ? (
        notifications
          .filter((notification) => !notification.isRead)
          .map((notification) => (
            <li
              key={notification.id}
              className="max-w-4xl m-auto border border-primary p-4 rounded-lg mb-4 flex items-center justify-between  gap-x-10"
            >
              <div className="flex flex-col ">
                {notification.message}
                <span className="text-muted-foreground">
                  ({formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })} ago)
                </span>
              </div>
              {!notification.isRead && (
                <button
                  className="bg-primary text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleReadClick(notification.id)}
                >
                  Read
                </button>
              )}
            </li>
          ))
      ) : (
        <p className="max-w-4xl m-auto">You have already read all notifications.</p>
      )
    ) : (
      <p className="max-w-4xl m-auto">You have no notifications.</p>
    )}
  </ul>
  );
};

export default NotificationList;