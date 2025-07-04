import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getScrapingHistory,
  clearScrapedData,
} from "../features/scrapper/scrapper.slice";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Globe,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Building,
  MapPin,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info,
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

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

const ScrapedData = () => {
  const dispatch = useAppDispatch();
  const {
    history = [],
    loading,
    error,
  } = useAppSelector((state) => state.scrapper);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ScrapedDataItem | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dispatch(getScrapingHistory());
  }, [dispatch]);

  const handleClearData = async () => {
    try {
      await dispatch(clearScrapedData()).unwrap();
      toast.success("All scraped data cleared successfully!");
      dispatch(getScrapingHistory());
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Failed to clear data. Please try again.");
    }
  };

  const filteredData = history.filter((item: ScrapedDataItem) => {
    if (!item) return false;

    const title = item.title || "";
    const url = item.url || "";
    const companyName = item.companyInfo?.name || "";
    const statusCode = item.metadata?.statusCode || 0;

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "success" && statusCode === 200) ||
      (statusFilter === "error" && statusCode !== 200);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-[#6FFFB4]" />
            <span className="text-lg">Loading scraped data...</span>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6FFFB4] to-[#4ECDC4] bg-clip-text text-transparent">
            Scraped Data
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and view all your scraped website data
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => dispatch(getScrapingHistory())}
            className="bg-[#121a2a] border-[#1e293b] hover:bg-[#1e293b]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={history.length === 0}
                className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0a101f] border-[#1e293b]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400">
                  Clear All Data
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear all scraped data? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#121a2a] border-[#1e293b] hover:bg-[#1e293b]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearData}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0a101f] border-[#1e293b]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#6FFFB4]" />
              <div>
                <p className="text-sm text-gray-400">Total Scraped</p>
                <p className="text-2xl font-bold text-white">
                  {history.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a101f] border-[#1e293b]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Successful</p>
                <p className="text-2xl font-bold text-white">
                  {
                    history.filter((item) => item?.metadata?.statusCode === 200)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a101f] border-[#1e293b]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">With Company Info</p>
                <p className="text-2xl font-bold text-white">
                  {history.filter((item) => item?.companyInfo?.name).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, URL or company name..."
              className="pl-9 bg-[#0a101f] border-[#1e293b]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#0a101f] border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#0a101f] border-[#1e293b]">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="success">Success (200)</SelectItem>
              <SelectItem value="error">Errors (400+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <Card className="bg-[#0a101f] border-[#1e293b]">
            <CardContent className="p-12 text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No Data Found
              </h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "No scraped data matches your current filters."
                  : "Start scraping websites to see your data here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((item: ScrapedDataItem, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-[#0a101f] border-[#1e293b] hover:border-[#6FFFB4]/30 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <Globe className="h-5 w-5 text-[#6FFFB4] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {item.url}
                          </p>
                        </div>
                      </div>

                      {item.companyInfo?.name && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Building className="h-4 w-4 text-blue-400" />
                          <span>{item.companyInfo.name}</span>
                          {item.companyInfo.location && (
                            <>
                              <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                              <span className="text-gray-400">
                                {item.companyInfo.location}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.metadata?.responseTime || "N/A"}ms
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          item.metadata?.statusCode
                        )} border`}
                      >
                        {getStatusIcon(item.metadata?.statusCode)}
                        <span className="ml-1">
                          {item.metadata?.statusCode || "N/A"}
                        </span>
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetails(true);
                        }}
                        className="bg-[#121a2a] border-[#1e293b] hover:bg-[#1e293b]"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
          <AlertDialogContent className="bg-[#0a101f] border-[#1e293b] max-w-4xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#6FFFB4] flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {selectedItem.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {selectedItem.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              {selectedItem.description && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Description</h4>
                  <p className="text-gray-300 text-sm">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {selectedItem.companyInfo?.name && (
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Company Information
                  </h4>
                  <div className="bg-[#121a2a] p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-white">
                          {selectedItem.companyInfo.name}
                        </p>
                      </div>
                      {selectedItem.companyInfo.industry && (
                        <div>
                          <p className="text-sm text-gray-400">Industry</p>
                          <p className="text-white">
                            {selectedItem.companyInfo.industry}
                          </p>
                        </div>
                      )}
                      {selectedItem.companyInfo.location && (
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedItem.companyInfo.location}
                          </p>
                        </div>
                      )}
                      {selectedItem.companyInfo.employees && (
                        <div>
                          <p className="text-sm text-gray-400">Employees</p>
                          <p className="text-white flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {selectedItem.companyInfo.employees}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedItem.companyInfo.contact && (
                      <div className="pt-2 border-t border-[#1e293b]">
                        <p className="text-sm text-gray-400 mb-2">Contact</p>
                        <div className="space-y-1">
                          {selectedItem.companyInfo.contact.email && (
                            <p className="text-white flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {selectedItem.companyInfo.contact.email}
                            </p>
                          )}
                          {selectedItem.companyInfo.contact.phone && (
                            <p className="text-white flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {selectedItem.companyInfo.contact.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-white mb-2">Metadata</h4>
                <div className="bg-[#121a2a] p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Status</p>
                      <Badge
                        className={getStatusColor(
                          selectedItem.metadata?.statusCode
                        )}
                      >
                        {selectedItem.metadata?.statusCode}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-400">Response Time</p>
                      <p className="text-white">
                        {selectedItem.metadata?.responseTime}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Content Length</p>
                      <p className="text-white">
                        {selectedItem.metadata?.contentLength?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Scraped At</p>
                      <p className="text-white">
                        {selectedItem.metadata?.scrapedAt &&
                          formatDate(selectedItem.metadata.scrapedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#121a2a] border-[#1e293b] hover:bg-[#1e293b]">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ScrapedData;
