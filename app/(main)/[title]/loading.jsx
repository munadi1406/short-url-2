import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoading() {
  return (
    <div
      className="p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Image Skeleton */}
        <div className="h-[10rem] w-full relative">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        {/* Content Skeleton */}
        <div className="px-2 flex flex-col gap-2 w-full relative -top-10">
          <div
            className="backdrop-blur-lg p-2 flex gap-2 w-full rounded-md"
            style={{
              background: "rgba(255, 255, 255, 0.5)",
            }}
          >
            {/* Small Image Skeleton */}
            <Skeleton className="h-[200px] w-[100px] rounded-md" />

            {/* Title and Details Skeleton */}
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-6 w-16 border rounded-md"
                  />
                ))}
              </div>
              <Skeleton className="h-5 w-1/3 mt-2" />
              <Skeleton className="h-5 w-1/2 mt-2" />
              <Skeleton className="h-8 w-24 mt-4 rounded-md" />
            </div>
          </div>

          {/* Description Skeleton */}
          <Skeleton className="h-5 w-full mt-4" />
          <Skeleton className="h-5 w-3/4 mt-2" />

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 my-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-6 w-16 border rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
