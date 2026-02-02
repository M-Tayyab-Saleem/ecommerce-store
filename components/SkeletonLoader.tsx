export function ProductCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="container-custom py-10 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Skeleton */}
                <div>
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
