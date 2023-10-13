import { Skeleton } from "./ui/skeleton";

export function SkeletonMsg() {
  return (
    <div className="flex justify-end relative items-center">
      <Skeleton className="h-10 w-[250px]"/>
    </div>
  );
}


