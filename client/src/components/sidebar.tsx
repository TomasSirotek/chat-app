import { cn } from "@/lib/utils";
import { Chat } from "@/models/Chat";
import { SideBarItem } from "./sidebarItem";
import { SkeletonDemo } from "./skeletonEmpty";
import { User } from "@/models/User";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  useFetchRecipientUser,
  useFetchRecipientUsers,
} from "@/hooks/useFetchRecipient";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons";
import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ChatContext } from "@/context/ChatContext";
import { PenSquare } from "lucide-react";
import { getAbbreviatedDayOfWeek } from "@/helpers/dateHelper";
import { Badge } from "./ui/badge";
import { unreadNotificationsFunc } from "@/utils/unreadNotificationsFunc";
import { useFetchLatestMsg } from "@/hooks/fetchLatestMsg";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  chats: Chat[] | null | undefined;
  isLoading: boolean;
  user: User | null;
  pChats: User[] | null | undefined;
  createChat: (firstId: number, secondId: number) => void
  updateCurrChat: (chat: Chat) => void
}

export function Sidebar({
  className,
  chats,
  isLoading,
  createChat,
  updateCurrChat,
  user,
  pChats,
}: SidebarProps) {
  const [selectedUser, setSelectedUser] = useState<User>();

  const recipientUsers = useFetchRecipientUsers(chats as Chat[], user as User);

  const { onlineUsers,notification, markThisUserNotificationsAsRead } =
    useContext(ChatContext) as any;

  const unreadNotifications = unreadNotificationsFunc(notification);

  const [open, setOpen] = useState(false);

  const { currChat } = useContext(ChatContext) || {};

  // const { latestMsg ,loading} = useFetchLatestMsg(chats as Chat[]);
  const handleOpen = () => {
    setSelectedUser(undefined);
    open ? setOpen(false) : setOpen(true);
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-4">
          <div className="flex justify-center">
            <div>
              <h2 className=" px-4 text-lg font-semibold tracking-tight text-black dark:text-white">
                Chats
              </h2>
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="ml-auto rounded-full"
                    onClick={() => setOpen(true)}
                  >
                    <PenSquare className="h-4 w-4 dark:text-white" />
                    <span className="sr-only">New message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>New message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Command className="rounded-t-none  bg-transparent">
            <CommandInput placeholder="Search user..." />
            <CommandList isSidebar>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {chats?.map((chat, index) => (
            
                  <CommandItem
                    key={index}
                    className={`${
                      currChat?.id === chat.id
                        ? "bg-gray-200 rounded-lg flex py-4 dark:bg-gray-500 flex items-center px-2 current-chat"
                        : "dark:bg-transparent hover:bg-gray-200 hover:rounded-lg flex py-4 flex items-center px-2"
                    }`}
                    onSelect={() => {
                      updateCurrChat(chat);
                      if(notification?.length !== 0){
                        markThisUserNotificationsAsRead(
                          unreadNotifications?.filter(
                            (n: any) => n?.senderId === recipientUsers?.[index].id),
                          notification 
                        );
                      }
                    }}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F11%2FAvatar-PNG-Transparent-Image.png&f=1&nofb=1&ipt=c7193ab3a8d076d9ff54328b402263e98b33f4c8374e50950fcef0fb7ccb43f8&ipo=images"
                          alt="Avatar"
                        />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>

                      <span
                        className={
                          onlineUsers?.some(
                            (u: any) =>
                              u.userId ===
                              (recipientUsers && recipientUsers[index]?.id)
                          ) ||
                          undefined ||
                          null
                            ? "bg-green-400 rounded-full w-3 h-3 absolute top-0 right-0"
                            : "bg-red-500 rounded-full w-3 h-3 absolute top-0 right-0"
                        }
                      ></span>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none truncate w-24" >
                        {recipientUsers && recipientUsers[index]?.username}
                      </p>
                      <div>
                        <p className="text-sm text-muted-foreground truncate w-32">
                          
                         {/* {loading ? latestMsg && latestMsg[index] : "Loading..."} */}
                         Message
                        </p>
                      </div>
                      </div>
                    <div className="ml-auto text-xs flex flex-col text-end">
                      <span className="text-muted-foreground text-gray-400 ">
                        {chat?.updated_at &&
                          getAbbreviatedDayOfWeek(new Date(chat.updated_at))}
                      </span>
                      <span className={  unreadNotifications?.filter(
                              (n: any) => n.senderId === recipientUsers?.[index].id
                            ).length > 0 ? "" : "hidden"}>
                        <Badge variant="default">
                          {
                             unreadNotifications?.filter(
                              (n: any) => n.senderId === recipientUsers?.[index].id
                            ).length
                          }

                        </Badge>
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        <Dialog open={open} onOpenChange={handleOpen}>
          <DialogContent className="gap-0 p-0 outline-none">
            <DialogHeader className="px-4 pb-4 pt-5">
              <DialogTitle>New message</DialogTitle>
              <DialogDescription>
                Select a contact to chat with
              </DialogDescription>
            </DialogHeader>
            <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
              <CommandInput placeholder="Search user..." />
              <CommandList isSidebar={false}>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup className="p-2">
                  {pChats?.map((user) => (
                    <CommandItem
                      key={user.id}
                      className="flex items-center px-2"
                      onSelect={() => {
                        setSelectedUser(user);
                      }}
                    >
                      <Avatar>
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium leading-none">
                          {user.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {selectedUser?.id === user.id ? (
                        <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
              <Button
                disabled={selectedUser === undefined}
                onClick={() => {
                  createChat(user?.id!, selectedUser?.id!);
                  setOpen(false);
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
