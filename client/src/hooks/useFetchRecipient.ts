import { axiosPrivate } from "@/api/axios";
import { environment } from "@/environments/environment";
import { Chat } from "@/models/Chat";
import { User } from "@/models/User";
import { getRequest } from "@/utils/Service";
import { useEffect, useState } from "react";

export const useFetchRecipientUser = (chat: Chat | null, user: User | null) => {
  const [recipientUser, setRecipientUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO : FIX TYPES
  const recipientId = chat?.members.find((id) => id !== user?.id) ?? undefined;

  useEffect(() => {
    const getUserById = async () => {
      if (!recipientId) return null;

   

      const response = await axiosPrivate.get(`/users/${user?.id}`);
  

      if (response.data.err) return setError(response.data.message);

      setRecipientUser(response.data);
      return null;
    };

    getUserById();
  }, [recipientId]);

  return { recipientUser, error };
};

// Update your useFetchRecipientUsers function to call the new endpoint
export const useFetchRecipientUsers = (chats: Chat[], user: User) => {
  const [recipientUsers, setRecipientUsers] = useState<User[]>();

  useEffect(() => {
    const fetchRecipientUsers = async () => {
      if (chats && chats.length > 0) {
        // Get the chat ids except the current user's id
        const chatIds = chats.map((chat) => chat.id);

        try {
        
          const response = await axiosPrivate.get(`/chats/recipient-users/${chatIds.join(",")}`);
          
          // Filter out the current user's ID from the recipientUsers
            const filteredRecipientUsers = response.data.filter(
              (recipient: any) => recipient.id !== user.id
            );
            setRecipientUsers(filteredRecipientUsers);
        } catch (error : any) {
          console.error("Error fetching recipient users:", error.message);
        }
      }
    };

    fetchRecipientUsers();
  }, [chats, user]);

  return recipientUsers;
};
