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
import { clearScrapedData } from "../features/scrapper/scrapper.slice";

const ScrapeNow = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.scrapper);

  useEffect(() => {
    return () => {
      dispatch(clearScrapedData());
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Web Scraper</CardTitle>
        </CardHeader>
        <CardContent>
          <ScraperForm />
          {data && <ScraperResults />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapeNow;
