import { ModeToggle } from "./mode-toggle";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./ui/menubar";
import { UserNav } from "./user-nav";

export function Menu({ logoutUser }: { logoutUser: () => void})  {
  return (
    <Menubar className="rounded-none border-b border-none flex h-12 items-center justify-between px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold text-black dark:text-white text-xl">
          ChatApp
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About ChatApp</MenubarItem>
        </MenubarContent>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav logoutUser={logoutUser}/>
          <ModeToggle />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}
