import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { User } from "../models/User";
import { getRequest, postRequest } from "../utils/Service";
import { environment } from "../environments/environment";
import { useAlert } from "../providers/AlertProvider";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import { io } from "socket.io-client";
import { Notification } from "@/models/Notification";

interface ChatContextValue {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  potentialChats: User[] | null;
  currChat: Chat | null;
  messages: Message[] | null;
  isMessagesLoading: boolean | null;
  isMsgSending: boolean | null;
  onlineUsers: User[];
  notification: Notification[];
  
  
  // FIX TYPES
  createMessage: (chatId: number, senderId: number, body: string) => void;
  createChat: (firstId: number, secondId: number) => void ;
  updateCurrChat: (chat: Chat) => void;
  markThisUserNotificationsAsRead : any

  typingUsers: any;
  startTyping : any;

}

export const ChatContext = createContext<ChatContextValue | undefined>(
  undefined
);

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) => {
  const [userChats, setUserChats] = useState<Chat[] | null>([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [potentialChats, setPotentialChats] = useState<User[] | null>([]);
  const [currChat, setCurrChat] = useState<Chat | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessagesLoading, setMessagesLoading] = useState<boolean | null>(
    null
  );
  const [isMsgSending, setIsMsgSending] = useState<boolean | null>(false);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const { showAlert, hideAlert } = useAlert();

  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const [socket, setSocket] = useState<any | null>(null);
  const [notification, setNotification] = useState<Notification[]>([]);
  
  
 

  useEffect(() => {
    const nSocket = io("http://localhost:3000/");
    setSocket(nSocket);

    return () => {
      nSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null || !user?.id) return;

    socket.emit("join", {
      userId: user.id,
      socketId: socket.id,
    });

    socket.on("getUsersOnline", (users: User[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getUsersOnline");
    };
  }, [socket]);

 

  // send message to server
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currChat?.members.find((id) => id !== user?.id);

    if (!recipientId) return;

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // recieve message to server
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (message: Message) => {
      if (currChat?.id === message.chatId) {
        setMessages((prevMessages: Message[]) => [...prevMessages, message]);
      }
    });

    socket.on("getNotification", (notification: Notification) => {
      const isChatOpen = currChat?.members.some(
        (id) => id.toString() === notification.senderId.toString()
      );

      if (isChatOpen) {
        setNotification((prev: Notification[]) => [
          { ...notification, isRead: true },
          ...prev,
        ]);
      } else {
        setNotification((prev: Notification[]) => [notification, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currChat]);


  const [typingUsers, setTypingUsers] = useState<string[]>([]);
 
  const startTyping = () => {
    if (socket === null || !currChat) return;
    const recipientId = currChat.members.find((id) => id !== user?.id);
    if (recipientId) {
      socket.emit('typing', {
        isTyping: true,
        recipientId,
        chatId: currChat.id,
      });
    }
  };

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | null = null;
  
    if (socket === null || !currChat) return;
  
    const handleUserTyping = (data: any) => {
      if (currChat.id === data.chatId) {
        const isTyping = data.isTyping;
        setTypingUsers((prevTypingUsers: string[]) => {
          if (isTyping) {
            if (!prevTypingUsers.includes(data.recipientId)) {
              return [...prevTypingUsers, data.recipientId];
            }
          } else {
            return prevTypingUsers.filter((userId) => userId !== data.recipientId);
          }
          return prevTypingUsers;
        });
  
        // Clear the previous timeout (if any)
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
  
        // Set a new timeout to remove the user from typingUsers after 5 seconds
        typingTimeout = setTimeout(() => {
          setTypingUsers((prevTypingUsers) =>
            prevTypingUsers.filter((userId) => userId !== data.recipientId)
          );
        }, 1000);
      }
    };
  
    socket.on("userTyping", handleUserTyping);
  
    return () => {
      socket.off("userTyping", handleUserTyping);
    };
  }, [currChat, socket]);
 
  useEffect(() => {
    const getUsers = async () => {
      // geting all users
      const response = await getRequest(`${environment.BASE_URL}/users`);

      // TODO: Better error handling
      if (response.err) return console.log(response.msg);

      const pChats = response.filter((u: User) => {
        if (user && user.id === u.id) {
          return false; // Skip the logged-in user
        }

        if (userChats) {
          const isChatCreated = userChats.some((chat : any) => {
            return chat.members.includes(u.id);
          });

          return !isChatCreated;
        }

        return true; // If userChats is not available, include all users
      });

      setPotentialChats(pChats);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?.id) {
        setIsUserChatsLoading(true);

        const response = await getRequest(
          `${environment.BASE_URL}/chats/${user?.id}`
        );

        if (response.err) return setIsUserChatsLoading(false);

        setUserChats(response);
        setIsUserChatsLoading(false);
      }
    };

    getUserChats();
  }, [user,notification]);

  useEffect(() => {
    if (!currChat) return;
    const getMessages = async () => {
      setMessagesLoading(true);

      const response = await getRequest(
        `${environment.BASE_URL}/messages/${currChat?.id}`
      );

      if (response.err) return setMessagesLoading(false);

      setMessages(response);
      setMessagesLoading(false);
    };

    getMessages();
  }, [currChat]);

  const updateCurrChat = useCallback((chat: Chat) => {
    setCurrChat(chat);
  }, []);

  const createChat = useCallback(async (firstId: number, secondId: number) => {
    const response = await postRequest(
      `${environment.BASE_URL}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.err) {
      showAlert(response.msg, "warning");
      return;
    } // Show the error message

    setUserChats((prevChats) => [...(prevChats ?? []), response]);
  }, []);

  const createMessage = useCallback(
    async (chatId: number, senderId: number, body: string) => {


      const response = await postRequest(
        `${environment.BASE_URL}/messages`,
        JSON.stringify({ chatId, senderId, body })
      );

      if (response.err) {
        setIsMsgSending(false);
        showAlert(response.msg, "warning");
        return;
      } // Show the error message

      setNewMessage(response);

      setMessages((prevMessages: Message[]) => [
        ...(prevMessages ?? []),
        response
      ]);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications : Notification[], notifications : Notification[]) => {
    const updatedNotifications = notifications.map((notification: Notification) => {
        const matchingNotification = thisUserNotifications.find((n: Notification) => n.senderId === notification.senderId);

        if (matchingNotification) {
            return { ...matchingNotification, isRead: true };
        }

        return notification;
    });

    setNotification(updatedNotifications);
}, []);


  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrChat,
        currChat,
        messages,
        isMessagesLoading,
        createMessage,
        isMsgSending,
        onlineUsers,
        notification,
        markThisUserNotificationsAsRead,
        typingUsers,
        startTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
