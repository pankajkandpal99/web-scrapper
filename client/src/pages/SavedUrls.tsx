import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getScrapingHistory,
  scrapeWebsite,
  bulkRescrape,
  deleteScrapedItems,
} from "../features/scrapper/scrapper.slice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Link,
  Calendar,
  Clock,
  Eye,
  Building,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info,
  ExternalLink,
  Globe,
  Bookmark,
  Loader2,
  Share2,
  Download,
  Trash2,
} from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { LoadMore } from "../components/general/LoadMore";

interface ScrapedDataItem {
  _id: string;
  url: string;
  title: string;
  description?: string;
  content: string;
  metadata?: {
    scrapedAt?: string;
    responseTime?: number;
    statusCode?: number;
    contentLength?: number;
  };
  companyInfo?: {
    name?: string;
    description?: string;
    website?: string;
    location?: string;
    industry?: string;
    employees?: string;
    founded?: string;
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const SavedUrls = () => {
  const dispatch = useAppDispatch();
  const { history, loading, error } = useAppSelector((state) => state.scrapper);

  // State for basic functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [rescrapingUrl, setRescrapingUrl] = useState<string>("");

  // State for new features
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    hasCompanyInfo: false,
    minResponseTime: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(getScrapingHistory());
  }, [dispatch]);

  // Data processing
  const filteredAndSortedData = history
    .filter((item: ScrapedDataItem) => {
      const itemTitle = item?.title || "";
      const itemUrl = item?.url || "";
      const companyName = item?.companyInfo?.name || "";
      const statusCode = item?.metadata?.statusCode;

      // Basic search and status filter
      const matchesSearch =
        itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "success" && statusCode === 200) ||
        (statusFilter === "error" && statusCode !== 200);

      // Advanced filters
      const matchesCompanyFilter =
        !advancedFilters.hasCompanyInfo || !!item.companyInfo;

      const matchesResponseTime =
        (item.metadata?.responseTime ?? 0) >= advancedFilters.minResponseTime;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompanyFilter &&
        matchesResponseTime
      );
    })
    .sort((a: ScrapedDataItem, b: ScrapedDataItem) => {
      const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      const aTitle = a?.title || "";
      const bTitle = b?.title || "";
      const aUrl = a?.url || "";
      const bUrl = b?.url || "";
      const aStatus = a?.metadata?.statusCode || 0;
      const bStatus = b?.metadata?.statusCode || 0;

      switch (sortBy) {
        case "newest":
          return bDate - aDate;
        case "oldest":
          return aDate - bDate;
        case "title":
          return aTitle.localeCompare(bTitle);
        case "url":
          return aUrl.localeCompare(bUrl);
        case "status":
          return bStatus - aStatus;
        default:
          return 0;
      }
    });

  const displayData = filteredAndSortedData.slice(0, visibleCount);

  // Handlers
  const handleReScrape = async (url: string) => {
    setRescrapingUrl(url);
    try {
      await dispatch(scrapeWebsite(url)).unwrap();
      toast.success("Website re-scraped successfully!");
      dispatch(getScrapingHistory());
    } catch (error) {
      console.error("Error occured while handling re-scraping : ", error);
      toast.error("Failed to re-scrape website. Please try again.");
    } finally {
      setRescrapingUrl("");
    }
  };

  const handleBulkRescrape = async () => {
    try {
      const urls = history
        .filter((item) => selectedIds.includes(item._id))
        .map((item) => item.url);

      await dispatch(bulkRescrape(urls)).unwrap();
      toast.success(`Re-scraped ${urls.length} URLs successfully!`);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error occured while bulk re-scraping : ", error);
      toast.error("Failed to re-scrape selected URLs");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await dispatch(deleteScrapedItems(selectedIds)).unwrap();
      toast.success(`Deleted ${selectedIds.length} URLs successfully!`);
      setSelectedIds([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error occured while bulk deletion : ", error);
      toast.error("Failed to delete selected URLs");
    }
  };

  const handleViewDetails = (url: string) => {
    setSelectedUrl(url);
    setShowPreview(true);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 50);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const headers = [
      "URL",
      "Title",
      "Status",
      "Company",
      "Date",
      "Response Time",
    ];
    const csvRows = displayData.map((item) =>
      [
        `"${item.url}"`,
        `"${item.title}"`,
        item.metadata?.statusCode || "N/A",
        `"${item.companyInfo?.name || "None"}"`,
        `"${formatDate(item.createdAt)}"`,
        item.metadata?.responseTime || "N/A",
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `scraped-data-${new Date().toISOString()}.csv`;
    link.click();
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return "N/A";
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (statusCode?: number) => {
    if (statusCode === undefined)
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    if (statusCode >= 200 && statusCode < 300)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (statusCode >= 400)
      return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const getStatusIcon = (statusCode?: number) => {
    if (statusCode === undefined) return <Info className="h-3 w-3" />;
    if (statusCode >= 200 && statusCode < 300)
      return <CheckCircle2 className="h-3 w-3" />;
    if (statusCode >= 400) return <AlertCircle className="h-3 w-3" />;
    return <Info className="h-3 w-3" />;
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getSelectedItem = () => {
    return history.find((item: ScrapedDataItem) => item.url === selectedUrl);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-[#6FFFB4]" />
            <span className="text-lg">Loading saved URLs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6FFFB4] to-[#4ECDC4] bg-clip-text text-transparent">
            Saved URLs
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your scraped websites and data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#6FFFB4]/20 text-[#6FFFB4]">
            {filteredAndSortedData.length} URLs
          </Badge>
          <Button
            onClick={() => {
              dispatch(getScrapingHistory());
              setVisibleCount(50);
            }}
            variant="outline"
            size="sm"
            className="border-[#6FFFB4]/20 text-[#6FFFB4] hover:bg-[#6FFFB4]/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="border-[#6FFFB4]/20 text-[#6FFFB4] hover:bg-[#6FFFB4]/10"
            disabled={displayData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search URLs, titles, or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 focus:border-[#6FFFB4]/50"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasCompanyInfo"
              checked={advancedFilters.hasCompanyInfo}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  hasCompanyInfo: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-[#6FFFB4] focus:ring-[#6FFFB4]"
            />
            <label htmlFor="hasCompanyInfo" className="text-sm">
              Has Company Info
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Min Response Time (ms):</label>
            <input
              type="number"
              value={advancedFilters.minResponseTime}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  minResponseTime: Number(e.target.value) || 0,
                })
              }
              className="w-20 px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-sm"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* URLs Grid */}
      {displayData.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No URLs Found
            </h3>
            <p className="text-gray-400">
              {searchTerm ||
              statusFilter !== "all" ||
              advancedFilters.hasCompanyInfo
                ? "No URLs match your current filters"
                : "Start scraping websites to see them here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((item: ScrapedDataItem, index: number) => {
            const statusCode = item.metadata?.statusCode;
            const responseTime = item.metadata?.responseTime || 0;
            const createdAt = item.createdAt;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => toggleSelectItem(item._id)}
                  className="absolute top-4 right-4 h-4 w-4 rounded border-gray-300 text-[#6FFFB4] focus:ring-[#6FFFB4] z-10"
                />
                <Card className="bg-gray-900/50 border-gray-700 hover:border-[#6FFFB4]/50 transition-all duration-300 group h-full flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#6FFFB4]" />
                        <Badge
                          className={`text-xs ${getStatusColor(statusCode)}`}
                        >
                          {getStatusIcon(statusCode)}
                          <span className="ml-1">{statusCode || "N/A"}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyUrl(item.url)}
                          className="h-8 w-8 p-0"
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenUrl(item.url)}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {truncateText(item.title, 60)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Link className="h-3 w-3" />
                      <span>{getDomainFromUrl(item.url)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow overflow-hidden flex flex-col">
                    {item.description && (
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {item.companyInfo ? (
                      <div className="space-y-2 flex-grow overflow-hidden">
                        <div className="max-h-[100px] overflow-y-auto">
                          {item.companyInfo.name && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="h-3 w-3 text-[#6FFFB4]" />
                              <span>{item.companyInfo.name}</span>
                            </div>
                          )}
                          {item.companyInfo.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3 text-[#6FFFB4]" />
                              <span>{item.companyInfo.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No company information available
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatResponseTime(responseTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(item.url)}
                        className="flex-1 border-[#6FFFB4]/20 text-[#6FFFB4] hover:bg-[#6FFFB4]/10"
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReScrape(item.url)}
                        disabled={rescrapingUrl === item.url}
                        className="border-gray-600 hover:bg-gray-700"
                      >
                        {rescrapingUrl === item.url ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      <LoadMore
        visibleCount={visibleCount}
        totalCount={filteredAndSortedData.length}
        onLoadMore={handleLoadMore}
      />

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-lg shadow-lg border border-[#6FFFB4]/30 z-50">
          <div className="flex gap-4 items-center">
            <span className="text-sm text-[#6FFFB4]">
              {selectedIds.length} selected
            </span>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleBulkRescrape}
              size="sm"
              className="bg-[#6FFFB4] text-black hover:bg-[#6FFFB4]/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-scrape
            </Button>
            <Button
              onClick={() => setSelectedIds([])}
              variant="outline"
              size="sm"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete {selectedIds.length} selected
              URLs? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 flex flex-col">
          <AlertDialogHeader className="flex-shrink-0 px-6">
            <AlertDialogTitle className="text-[#6FFFB4]">
              {getSelectedItem()?.title || "No title available"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <a
                  href={getSelectedItem()?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6FFFB4] hover:underline"
                >
                  {getSelectedItem()?.url || "No URL available"}
                </a>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="overflow-y-auto flex-grow px-6">
            <div className="space-y-4">
              {getSelectedItem()?.description && (
                <p className="text-sm">{getSelectedItem()?.description}</p>
              )}

              {getSelectedItem()?.companyInfo && (
                <div className="bg-gray-800 rounded-lg p-4 max-h-[50vh] overflow-y-auto">
                  <h4 className="font-semibold text-white mb-2">
                    Company Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(getSelectedItem()?.companyInfo || {}).map(
                      ([key, value]) => {
                        if (typeof value === "object" && value !== null) {
                          return (
                            <div key={key} className="col-span-full">
                              <strong className="text-[#6FFFB4]">{key}:</strong>
                              <ul className="ml-4 mt-1 space-y-1">
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <li key={subKey} className="text-sm">
                                      <span className="text-gray-300">
                                        {subKey}:
                                      </span>{" "}
                                      {subValue || "N/A"}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          );
                        }
                        return (
                          <div key={key} className="break-words">
                            <strong className="text-[#6FFFB4]">{key}:</strong>{" "}
                            {typeof value === "string" ||
                            typeof value === "number"
                              ? value
                              : "N/A"}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>
                  Response Time:{" "}
                  {formatResponseTime(
                    getSelectedItem()?.metadata?.responseTime
                  )}
                </span>
                <span>
                  Status: {getSelectedItem()?.metadata?.statusCode || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex-shrink-0 px-6">
            <AlertDialogCancel className="border-gray-600">
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleReScrape(getSelectedItem()?.url || "")}
              className="bg-[#6FFFB4] text-black hover:bg-[#6FFFB4]/90"
            >
              Re-scrape
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedUrls;
