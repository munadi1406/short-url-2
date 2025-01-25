import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-1/4" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-1/2" />
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <div className="w-full flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-1/3" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div className="w-full border rounded-md grid grid-cols-2" key={i}>
                                <Skeleton className="h-6 w-3/4 p-2" />
                                <Skeleton className="h-6 w-1/4 p-2" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-1/3" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div className="w-full border rounded-md grid grid-cols-2" key={i}>
                                <Skeleton className="h-6 w-3/4 p-2" />
                                <Skeleton className="h-6 w-1/4 p-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PostSkeleton;
