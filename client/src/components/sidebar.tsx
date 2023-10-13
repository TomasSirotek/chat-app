import { cn } from "@/lib/utils";
import { Chat } from "@/models/Chat";
import { SideBarItem } from "./sidebarItem";
import { SkeletonDemo } from "./skeletonEmpty";
import { User } from "@/models/User";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useFetchRecipientUser, useFetchRecipientUsers } from "@/hooks/useFetchRecipient";
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
import PotentialChats from "@/pages/PotentialChats";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  chats: Chat[] | null | undefined;
  isLoading: boolean;
  user: User | null;
  pChats: User[] | null | undefined;
  createChat: (firstId: number, secondId: number) => void | undefined;
  updateCurrChat: (chat: Chat) => void | undefined;
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
  // here i need to provide single chat and user
  // but it is still fetching only 
  const recipientUsers  = useFetchRecipientUsers(chats as Chat[], user as User);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setSelectedUser(undefined);
    open ? setOpen(false) : setOpen(true);
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-4">
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
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">New message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>New message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="my-2" />
          <div>
            {isLoading ? (
              <SkeletonDemo />
            ) : (
              <div className="space-y-8">
                {chats?.map((chat, index) => (
                  <SideBarItem  recipientUser={recipientUsers && recipientUsers[index] || null} key={index} chat={chat} updateCurrChat={updateCurrChat}/>
                ))}
              </div>
            )}
          </div>
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
              <CommandList>
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
