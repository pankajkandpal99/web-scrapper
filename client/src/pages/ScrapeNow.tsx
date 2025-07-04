import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import ScraperForm from "../components/forms/ScraperForm";
import ScraperResults from "../components/general/ScraperResults";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { resetScraperError } from "../features/scrapper/scrapper.slice";
import { CheckCircle } from "lucide-react";
import { Alert } from "../components/ui/alert";

const ScrapeNow = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.scrapper);

  useEffect(() => {
    return () => {
      // dispatch(clearScrapedData());
      dispatch(resetScraperError());
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Web Scraper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <span>Successfully scraped website!</span>
            </Alert>
          )}
          <ScraperForm />
          {data && <ScraperResults />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapeNow;
