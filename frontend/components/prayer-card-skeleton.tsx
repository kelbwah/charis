import { Card } from "./ui/card";

interface PrayerCardSkeletonProps {
  showButtonActions: boolean;
}

export function PrayerCardSkeleton({
  showButtonActions,
}: PrayerCardSkeletonProps) {
  return (
    <div className="animate-pulse">
      <Card className="w-full max-w-md mx-auto overflow-hidden border-2 shadow-lg relative p-0">
        <div className="p-4 pb-2 bg-gradient-to-b from-primary/10 to-transparent flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20"></div>
          <div className="flex-1">
            <div className="h-4 bg-primary/20 rounded w-24 mb-2"></div>
            <div className="h-2 bg-primary/10 rounded w-16"></div>
          </div>
          <div className="h-8 w-8 rounded-md bg-primary/10"></div>
        </div>
        <div className="py-2.5 px-5">
          <div className="h-5 bg-primary/20 rounded w-full mb-2"></div>
          <div className="h-5 bg-primary/20 rounded w-full mb-2"></div>
          <div className="h-5 bg-primary/20 rounded w-3/4"></div>
          <div className="mt-3">
            <div className="inline-flex h-5 w-16 rounded-full border border-primary/30 bg-primary/5"></div>
          </div>
        </div>
        <div className="flex justify-between items-center pb-6 pl-4 pr-2.5 border-t border-primary/10">
          <div className="h-4 bg-primary/10 rounded w-32"></div>
          <div className="h-8 w-28 rounded-md bg-primary/10"></div>
        </div>
      </Card>
      {showButtonActions ? (
        <div className="flex justify-center gap-4 mt-6">
          <div className="h-12 w-12 rounded-full bg-primary/10"></div>
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
