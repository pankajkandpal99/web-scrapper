import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreProps {
  visibleCount: number;
  totalCount: number;
  onLoadMore: () => void;
  loading?: boolean;
  className?: string;
}

export const LoadMore = ({
  visibleCount,
  totalCount,
  onLoadMore,
  loading = false,
  className = "",
}: LoadMoreProps) => {
  if (visibleCount >= totalCount) return null;

  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <Button
        onClick={onLoadMore}
        variant="outline"
        disabled={loading}
        className="border-[#6FFFB4]/20 text-[#6FFFB4] hover:bg-[#6FFFB4]/10"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </span>
        ) : (
          `Load More (Showing ${visibleCount} of ${totalCount})`
        )}
      </Button>
    </div>
  );
};
