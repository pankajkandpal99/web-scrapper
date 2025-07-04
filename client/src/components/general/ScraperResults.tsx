import { useAppSelector } from "../../hooks/redux";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { Loader } from "./Loader";

const ScraperResults = () => {
  const { data, loading, error } = useAppSelector((state) => state.scrapper);

  if (loading) return <Loader />;
  if (error) return <Alert variant="destructive">{error}</Alert>;
  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scraping Results</h3>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy JSON
        </Button>
      </div>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm text-gray-900">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ScraperResults;
