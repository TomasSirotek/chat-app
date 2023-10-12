import { CardsChat } from "@/components/card-chat";
import { Menu } from "@/components/menu";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContexts";
import { ChatContext } from "@/context/ChatContext";
import { useContext } from "react";

const PotentialChats = () => {
  const { potentialChats } = useContext(ChatContext) || {};
  const { user } = useContext(AuthContext) || {};

  console.log("userChats =>>>>", potentialChats);

  return (
    <>

    </>
  );
};

export default PotentialChats;
