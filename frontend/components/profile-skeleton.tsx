import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar skeleton */}
      <div className="w-full md:w-1/3">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content skeleton */}
      <div className="w-full md:w-2/3">
        <Skeleton className="h-10 w-full mb-8" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-24 w-full" />
            </div>

            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
