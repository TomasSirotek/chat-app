import * as React from "react";
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Chat } from "@/models/Chat";
import { useFetchRecipientUser } from "@/hooks/useFetchRecipient";
import { useContext, useEffect } from "react";
import { Message } from "@/models/Message";
import { CheckCircle2, Settings, Trash } from "lucide-react";
import { getAbbreviatedTimeFromTheDate } from "@/helpers/dateHelper";
import { ChatContext } from "@/context/ChatContext";
import { SkeletonMsg } from "./empty-msg-skeleton";
import Lottie from "lottie-react";
import typing from "../animations/typing.json";
import AuthContext from "@/context/AuthContexts";

// Todo: Fix this so that it is not hardcoded and user can add to group chats
// however this has to have another db table and also more logic in the backend as well as the front end
const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
] as const;

type User = (typeof users)[number];

export function CardsChat({
  currentChat,
  createMessage,
}: {
  currentChat: Chat;
  createMessage: (chatId: number, senderId: number, body: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  // const { user } = useContext(AuthContext) || {};
  const { user } = useContext(AuthContext) || {};

  console.log("user", user)
  const { recipientUser } = useFetchRecipientUser(currentChat, user ?? null);

  const {
    isMessagesLoading,
    messages,
    typingUsers,
    startTyping,
    isMsgSending,
  } = useContext(ChatContext) || {};
  const scroll = React.useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;

  const style = {
    height: 80,
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    startTyping();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {recipientUser?.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {recipientUser?.email}
              </p>
            </div>
          </div>

          <div className="ml-auto">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full mr-2"
                    onClick={() => setOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add to the group chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>New Group</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => console.log("Settings")}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>Delete chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {isMessagesLoading ? (
              <SkeletonMsg />
            ) : (
              messages?.map((message, index) => (
                <div
                ref={scroll}
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.senderId === user?.id
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="flex items-center">
                  {message.senderId !== user?.id && (
                    <div className="flex flex-col items-center mr-2">
                      <div className="flex items-center">
                        <Avatar className="rounded-full overflow-hidden bg-transparent">
                          <AvatarImage
                            src="https://api.dicebear.com/7.x/bottts/svg"
                            alt="Image"
                          />
                          <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col p-1">
                    <span className="font-bold text-left">
                      {message.senderId === user?.id ? "You" : recipientUser?.username}
                    </span>
                    <span>
                      {message.body}
                      <span className="ml-2 text-xs">
                      {message?.createdAt &&
                        ` ${getAbbreviatedTimeFromTheDate(new Date(message.createdAt))}`}

                      </span>
                    </span>
                  </div>
                </div>
              </div>
              
              ))
            )}
          </div>

          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div
                className={cn("flex flex-col gap-2 rounded-lg py-2 text-sm")}
              >
                <div className="flex items-center">
                  <Lottie
                    animationData={typing}
                    loop={true}
                    style={style} // Adjust the width to make it smaller
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              createMessage(currentChat.id, user?.id as number, input);
              setInput("");
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <PaperPlaneIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New Group</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
            <CommandInput placeholder="Search user..." />
            <CommandList isSidebar={false}>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {users.map((user) => (
                  <CommandItem
                    key={user.email}
                    className="flex items-center px-2"
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        );
                      }

                      return setSelectedUsers(
                        [...users].filter((u) =>
                          [...selectedUsers, user].includes(u)
                        )
                      );
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt="Image" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    {selectedUsers.includes(user) ? (
                      <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar
                    key={user.email}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
