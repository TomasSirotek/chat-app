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

      const response = await getRequest(
        `${environment.BASE_URL}/users/${recipientId}`
      );

      if (response.err) return setError(response.msg);

      setRecipientUser(response);
      return null;
    };

    getUserById();
  }, [recipientId]);

  return { recipientUser, error };
};

export const useFetchRecipientUsers = (chats: Chat[], user: User) => {
  const [recipientUsers, setRecipientUsers] = useState<User[]>();

  useEffect(() => {
    const fetchRecipientUsers = async () => {
      if (chats && chats.length > 0) {
        // Get the chat ids except the current user's id
        const chatIds = chats.map((chat) => chat.id);

        try {
          // Call the new endpoint to fetch recipient users
          const response = await getRequest(
            `${environment.BASE_URL}/chats/recipient-users/${chatIds.join(",")}`
          );

          if (!response.err) {
            // Filter out the current user's ID from the recipientUsers
            const filteredRecipientUsers = response.filter(
              (recipient: any) => recipient.id !== user.id
            );
            setRecipientUsers(filteredRecipientUsers);
          }
        } catch (error) {
          console.error("Error fetching recipient users:", error);
        }
      }
    };

    fetchRecipientUsers();
  }, [chats, user]);

  return recipientUsers;
};
