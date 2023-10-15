import { CardsChat } from "@/components/card-chat";
import { Menu } from "@/components/menu";
import { Sidebar } from "@/components/sidebar";
import { AuthContext } from "@/context/AuthContexts";
import { ChatContext } from "@/context/ChatContext";
import { useContext, useEffect, useState } from "react";


const Chat = () => {
  const {
    userChats,
    isUserChatsLoading,
    currChat,
    potentialChats,
    createChat,
    createMessage,
    updateCurrChat,
    isMsgSending,
  } = useContext(ChatContext) || {};

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
                  <div className="h-full px-4 py-6 lg:px-8">
                    {currChat ? (
                      <CardsChat 
                       currentChat={currChat}
                       isMessageSending={isMsgSending || true}
                       createMessage={createMessage} />
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
