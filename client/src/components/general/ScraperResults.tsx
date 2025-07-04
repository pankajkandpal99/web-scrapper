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

  const isBulkResults = Array.isArray(data);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {isBulkResults ? "Bulk Scraping Results" : "Scraping Results"}
        </h3>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy JSON
        </Button>
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        {isBulkResults ? (
          <div className="space-y-4">
            {data.map((result, index) => (
              <div key={index} className="mb-4 pb-4 border-b">
                <h4 className="font-medium mb-2">URL: {result.url}</h4>
                <pre className="text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                  {JSON.stringify(result.data || result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ScraperResults;
