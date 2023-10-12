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
  }
  
  export const ChatContext = createContext<ChatContextValue | undefined>(
    undefined
  );
  
  export const ChatContextProvider = ({ children,user }: { children: ReactNode , user: User | null}) => {
    const [userChats, setUserChats] = useState<Chat[] | null>(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
    // const [userChatsError, setUserChatsErr] = useState<User | null>(null);

   // const { showAlert,hideAlert } = useAlert(); // Use the context hook

    useEffect(() => {
        const getUserChats = async () => {
            if(user?.id){
                console.log("user", user?.id)
                setIsUserChatsLoading(true);
                const response = await getRequest(`${environment.BASE_URL}/chats/${user?.id}`);
                console.log(response);

                if(response.err){
                    setIsUserChatsLoading(false);
                    return;
                }

                setUserChats(response);
                setIsUserChatsLoading(false);
            }
        
        };

        getUserChats();
    },[user]);

    return (
        <ChatContext.Provider
          value={{
            userChats,
            isUserChatsLoading,
          }}
        >
          {children}
        </ChatContext.Provider>
      );
  };