import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToolCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </div>
        <Skeleton className="h-px w-full mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-5 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
