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

interface ChatContextValue {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  potentialChats: User[] | null;
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


  useEffect(() => {

    const getUsers = async () => {
      const response = await getRequest(
        `${environment.BASE_URL}/users`
      );

      // TODO: Better error handling
      if (response.err) return console.log(response.msg);

      const pChats = response.filter((u : User) => { 
        
        let isChatCreated = false;

        // find logged in user
        if (user?.id === u?.id) return false;


        // TODO: Fix string later
        if (userChats) {
          isChatCreated = userChats?.some((chat: Chat) => {
            return (
              chat.members[0].firstId === u?.id ||
              chat.members[1].secondId === u?.id
            );
          });
        }

        return !isChatCreated;

      })

      setPotentialChats(pChats);
    }

    getUsers();

  },[userChats])


  useEffect(() => {
    const getUserChats = async () => {
      if (user?.id) {
        setIsUserChatsLoading(true);

        const response = await getRequest(
          `${environment.BASE_URL}/chats/${user?.id}`
        );

        if (response.err) {
          setIsUserChatsLoading(false);
          return;
        }

        setUserChats(response);

        setTimeout(() => {
          setIsUserChatsLoading(false);
        }, 2000);
      }
    };

    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        potentialChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
