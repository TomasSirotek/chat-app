
import { CardsChat } from "@/components/card-chat";
import { Menu } from "@/components/menu";
import { Sidebar } from "@/components/sidebar";

const Chat = () => {

    const chats = [] as any[];
  return (
    <>
     <div className=" min-h-screen h-full">
     <div className="md:block">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar chats={chats} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                    <CardsChat/>
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
