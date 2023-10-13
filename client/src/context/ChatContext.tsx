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

interface ChatContextValue {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  potentialChats: User[] | null;
  createChat: any;
  updateCurrChat: any;
  currChat: Chat | null;
  messages: Message[] | null;
  isMessagesLoading: boolean | null
  createMessage: any 
  isMsgSending: boolean | null
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
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [potentialChats, setPotentialChats] = useState<User[] | null>(null);
  const [currChat, setCurrChat] = useState<Chat | null>(null);

  const [messages, setMessages] = useState<any | null>(null);
  const [isMessagesLoading, setMessagesLoading] = useState<boolean | null>(null);
  const [messagesError, setMessagesError] = useState<boolean | null>(null);
  const [isMsgSending, setIsMsgSending] = useState<boolean | null>(null);
  const { showAlert, hideAlert } = useAlert(); // Use the context hook

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
  }, [user]);


  useEffect(() => {

    if(!currChat) return;
    const getMessages = async () => {
        setMessagesLoading(true);

        const response = await getRequest(
          `${environment.BASE_URL}/messages/${currChat?.id}`
        );

        if (response.err) return setMessagesLoading(false);

        setMessages(response);
        setMessagesLoading(false);
      }

    getMessages();
  }, [currChat]);

  const updateCurrChat = useCallback((chat: Chat) => {
      setCurrChat(chat);  
  } , []);

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


  const createMessage = useCallback(async (chatId: number, senderId: number, body: string) => {
    
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

    setMessages((prevMessages: Message[]) => [...(prevMessages ?? []), response]);
    
    setIsMsgSending(false);

  }
  , [messages]);

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
        isMsgSending
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
