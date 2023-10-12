import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Chat } from "@/models/Chat";
import { User } from "@/models/User";
import { useFetchRecipientUser } from "@/hooks/useFetchRecipient";
import { Badge } from "./ui/badge";

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  chat: Chat | null;
  user: User | null;
}

function getAbbreviatedDayOfWeek(dateString: Date) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ...

  return daysOfWeek[dayOfWeek];
}

export function SideBarItem({ chat, user }: SidebarItemProps) {
  const { recipientUser } = useFetchRecipientUser(chat, user);

  return (
    <>
      <div className="hover:bg-gray-200 hover:rounded-lg flex px-4 py-4 " role="button">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F11%2FAvatar-PNG-Transparent-Image.png&f=1&nofb=1&ipt=c7193ab3a8d076d9ff54328b402263e98b33f4c8374e50950fcef0fb7ccb43f8&ipo=images"
              alt="Avatar"
            />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <span className="bg-green-400 rounded-full w-3 h-3 absolute top-0 right-0"></span>
        </div>

        <div className="ml-4 space-y-1">
          <p className="text-sm text-black dark:text-white font-medium">
            {recipientUser?.username}
          </p>
          <p className="text-sm text-muted-foreground text-gray-400">
            Look we have not...
          </p>
        </div>
        <div className="ml-auto text-sm flex flex-col">
          <span>
            {chat?.updated_at &&
              getAbbreviatedDayOfWeek(new Date(chat.updated_at))}
          </span>
          <span>
            <Badge variant="destructive">2</Badge>
          </span>
        </div>
      </div>
    </>
  );
}
