import { CardsChat } from "@/components/card-chat";
import { Menu } from "@/components/menu";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContexts";
import { ChatContext } from "@/context/ChatContext";
import { Message } from "@/models/Message";
import { useContext } from "react";

const Chat = () => {
  const { userChats, isUserChatsLoading, currChat,messages,isMessagesLoading } =
    useContext(ChatContext) || {};    
  const { potentialChats, createChat, updateCurrChat } =
    useContext(ChatContext) || {};

  const { user } = useContext(AuthContext) || {};

  return (
    <>
      <div className=" min-h-screen h-full">
        <div className="md:block">
          <Menu />
          <div className="border-t">
            <div className="bg-background">
              <div className="grid lg:grid-cols-5">
                <Sidebar
                  isLoading={isUserChatsLoading ?? true}
                  chats={userChats}
                  updateCurrChat={updateCurrChat}
                  createChat={createChat}
                  pChats={potentialChats || null}
                  user={user || null}
                  className="hidden lg:block"
                />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  {/* NEEDS TO HAVE DIFFERENT LOGIC FOR LOADING MESSAGES LATER */}
                  <div className="h-full px-4 py-6 lg:px-8">
                    {currChat && !isMessagesLoading ?  (
                      <CardsChat 
                      currentChat={currChat} 
                      messages={messages as Message[]}
                      />
                    ) : (
                      // TODO: Fix this so that there is displayed the last chat that has been opened 
                      <div className="flex justify-center items-center h-full">
                        <span>Nothing selected for now </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
