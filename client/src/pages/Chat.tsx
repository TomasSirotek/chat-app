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
  } = useContext(ChatContext) || {};

  const { user, logoutUser } = useContext(AuthContext) || {};

  return (
    <>
      <div className=" bg-background ">
        <div>

          
          <Menu logoutUser={logoutUser || (() => {})} />
          <div className="border-t ">
            <div className="grid lg:grid-cols-5 ">
              <Sidebar
                isLoading={isUserChatsLoading ?? true}
                chats={userChats}
                updateCurrChat={updateCurrChat || (() => {})} 
                createChat={createChat || (() => {}) }
                pChats={potentialChats || null}
                user={user || null}
                className="hidden lg:block"
              />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className=" py-4 lg:px-2">
                  {currChat ? (
                    <CardsChat
                      currentChat={currChat}
                      createMessage={createMessage || (() => {}) }
                    />
                  ) : (
                    // Fix later with something else
                    <div className="flex justify-center items-center min-h-main">
                      <span>Nothing selected for now </span>
                    </div>
                  )}
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
