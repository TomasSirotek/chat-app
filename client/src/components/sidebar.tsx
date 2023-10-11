import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  chats: any[];
}

export function Sidebar({ className, chats }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-black dark:text-white">
            Chats
          </h2>
          <div className="space-y-1">
           {/* SPACE FOR CHATS */}
          </div>
        </div>
      </div>
    </div>
  );
}
