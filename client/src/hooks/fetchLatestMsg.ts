import { ChatContext } from "@/context/ChatContext";
import { environment } from "@/environments/environment";
import { Chat } from "@/models/Chat";
import { getRequest } from "@/utils/Service";

import { useContext, useEffect, useState } from "react";

// TODO: Fix fetching all of the lest since elephant is refusing to many connections 
export const useFetchLatestMsg = (chats: Chat[]) => {
    // const { newMessage, notification } = useContext(ChatContext) as any;
    // const [latestMsg, setLatestMsg] = useState<string[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
  
    // useEffect(() => {
    //   const getMessage = async () => {
    //     setLoading(true);
    //     const lastMessages: string[] = [];
    //     for (const chat of chats) {
    //       const response = await getRequest(`${environment.BASE_URL}/messages/${chat?.id}`);
          
    //       if (Array.isArray(response) && response.length > 0) {
    //         const lastMessage = response[response.length - 1];
    //         lastMessages.push(lastMessage);
    //       }
    //     }
  
    //     if (lastMessages.length > 0) {
    //       setLatestMsg(lastMessages.map((msg) => msg?.body));
    //       setLoading(false)
    //     }
    //   };
  
    //   getMessage();
    // }, [newMessage, notification]);
  
    // return { latestMsg ,loading};
  };
  