import { Chat } from "@/models/Chat";

export const unreadNotificationsFunc = (notification: any) => {
    return notification?.filter((notification: any) => notification?.isRead === false);
}