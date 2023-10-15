import React, { useContext } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Chat } from "@/models/Chat";
import { User } from "@/models/User";
import { useFetchRecipientUser } from "@/hooks/useFetchRecipient";
import { getAbbreviatedDayOfWeek } from "@/helpers/dateHelper";
import { ChatContext } from "@/context/ChatContext";

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  chat: Chat | null;
  updateCurrChat: (chat: Chat) => void | undefined;
  recipientUser: User | null;
  onlineUsers: User[]
}

export function SideBarItem({ chat,updateCurrChat,recipientUser,onlineUsers }: SidebarItemProps) {

   const isOnline = onlineUsers?.some((u:any) => u.userId === recipientUser?.id) || false;
  return (
    <>
      <div className="hover:bg-gray-200 hover:rounded-lg flex px-4 py-4 " role="button" onClick={() => updateCurrChat(chat as Chat)}>
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F11%2FAvatar-PNG-Transparent-Image.png&f=1&nofb=1&ipt=c7193ab3a8d076d9ff54328b402263e98b33f4c8374e50950fcef0fb7ccb43f8&ipo=images"
              alt="Avatar"
            />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>

          <span className={isOnline ? "bg-green-400 rounded-full w-3 h-3 absolute top-0 right-0" : "bg-red-500 rounded-full w-3 h-3 absolute top-0 right-0"}

   
          
          ></span>
        </div>

        <div className="ml-4 space-y-1">
          <p className="text-sm text-black dark:text-white font-medium">
            {recipientUser?.username}
          </p>
          {/* HERE IT HAS TO HAVE LATER ON THE PAST MESSAGES FROM THE CHAT */}
          <p className="text-sm text-muted-foreground text-gray-400">
            {recipientUser?.email}
          </p>
        </div>
        <div className="ml-auto text-sm flex flex-col">
          <span>
            {chat?.updated_at &&
              getAbbreviatedDayOfWeek(new Date(chat.updated_at))}
          </span>
          <span>
            {/* BRING BACK ONCE THIS IS NEEDED */}
            {/* <Badge variant="destructive">2</Badge> */}
          </span>
        </div>
      </div>
    </>
  );
}
