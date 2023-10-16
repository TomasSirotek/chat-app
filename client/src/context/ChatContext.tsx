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
import { Router } from "react-router-dom";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import { setTimeout } from "timers/promises";
import { io } from "socket.io-client";

interface ChatContextValue {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  potentialChats: User[] | null;
  createChat: any;
  updateCurrChat: any;
  currChat: Chat | null;
  messages: any[] | null;
  isMessagesLoading: boolean | null;
  createMessage: any;
  isMsgSending: boolean | null;
  onlineUsers: User[];
  notification: any[];
  markThisUserNotificationsAsRead : any;
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

  const [messages, setMessages] = useState<any[]>([]);
  const [isMessagesLoading, setMessagesLoading] = useState<boolean | null>(
    null
  );
  const [isMsgSending, setIsMsgSending] = useState<boolean | null>(null);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const { showAlert, hideAlert } = useAlert();

  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const [socket, setSocket] = useState<any | null>(null);
  const [notification, setNotification] = useState<any[]>([]);
  
  
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

    // console.log(recipientId, "from chat context - send message to server");

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // recieve message to server
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (message: any) => {
      if (currChat?.id === message.chatId) {
        setMessages((prevMessages: any) => [...prevMessages, message]);
      }
    });

    socket.on("getNotification", (notification: any) => {
      const isChatOpen = currChat?.members.some(
        (id) => id === notification.senderId
      );

      if (isChatOpen) {
        setNotification((prev: any) => [
          { ...notification, isRead: true },
          ...prev,
        ]);
      } else {
        setNotification((prev: any) => [notification, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currChat]);

  useEffect(() => {
    const getUsers = async () => {
      // geting all users
      const response = await getRequest(`${environment.BASE_URL}/users`);

      // TODO: Better error handling
      if (response.err) return console.log(response.msg);

      const pChats = response.filter((u: any) => {
        if (user && user.id === u.id) {
          return false; // Skip the logged-in user
        }

        if (userChats) {
          const isChatCreated = userChats.some((chat) => {
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

  const updateCurrChat = useCallback((chat: any) => {
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
      setIsMsgSending(true);
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
      console.log(response)
      setMessages((prevMessages: Message[]) => [
        ...(prevMessages ?? []),
        response,
      ]);

      setIsMsgSending(false);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications : any, notifications : any) => {
    const updatedNotifications = notifications.map((notification: any) => {
        const matchingNotification = thisUserNotifications.find((n: any) => n.senderId === notification.senderId);

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
        markThisUserNotificationsAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
