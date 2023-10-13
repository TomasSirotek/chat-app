import { environment } from "@/environments/environment";
import { Chat } from "@/models/Chat";
import { User } from "@/models/User";
import { getRequest } from "@/utils/Service";
import { useEffect, useState } from "react";



export const useFetchRecipientUser = (chat : Chat | null,user : User | null) => {
    const [recipientUser,setRecipientUser] = useState<User | null>(null);
    const [error,setError] = useState<string | null>(null);

    // TODO : FIX TYPES
    const recipientId = chat?.members.find((id) => id !== user?.id) ?? undefined;
    
    useEffect(() => {
        const getUserById = async () => {
          
            if(!recipientId) return null;

            const response = await getRequest(
                `${environment.BASE_URL}/users/${recipientId}`
              );

            if(response.err) return setError(response.msg);
                
            setRecipientUser(response);
    
        };
    
        getUserById();
      }, [recipientId]);
    
      return { recipientUser, error };
}
