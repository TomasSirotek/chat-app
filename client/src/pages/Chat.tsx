import { CardsChat } from "@/components/card-chat";
import { Menu } from "@/components/menu";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContexts";
import { ChatContext } from "@/context/ChatContext";
import { useContext } from "react";

const Chat = () => {
  const { userChats, isUserChatsLoading } = useContext(ChatContext) || {};
  const { potentialChats } = useContext(ChatContext) || {} ;

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
                    pChats={potentialChats || null}
                    user={user || null}
                    className="hidden lg:block"
                />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  <div className="h-full px-4 py-6 lg:px-8">
                    <CardsChat />
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
