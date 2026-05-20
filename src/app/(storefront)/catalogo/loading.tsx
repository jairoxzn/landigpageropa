import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-lucia py-10 md:py-14">
      <Skeleton className="h-10 w-64 mb-3" />
      <Skeleton className="h-5 w-96 mb-10" />
      <Skeleton className="h-24 w-full mb-8 rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/5] rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
