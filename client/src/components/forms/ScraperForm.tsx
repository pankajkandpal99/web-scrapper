/* eslint-disable no-useless-escape */
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader } from "../general/Loader";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  scrapeWebsite,
  scrapeMultipleWebsites,
} from "../../features/scrapper/scrapper.slice";
import { toast } from "sonner";
import { useEffect } from "react";

interface ScrapeFormValues {
  url: string;
  urls: string;
  mode: "single" | "bulk";
}

const ScraperForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.scrapper);
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScrapeFormValues>({
    defaultValues: {
      mode: "single",
      url: "",
      urls: "",
    },
  });

  const mode = watch("mode");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (data: ScrapeFormValues) => {
    try {
      if (data.mode === "bulk") {
        const urls = data.urls
          .split("\n")
          .map((url) => url.trim())
          .filter((url) => url.length > 0);

        const result = await dispatch(scrapeMultipleWebsites(urls)).unwrap();
        toast.success(`Successfully scraped ${result.length} URLs`);
      } else {
        await dispatch(scrapeWebsite(data.url)).unwrap();
        toast.success("Website scraped successfully!");
      }
      reset();
    } catch (err) {
      console.error("Scraping error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="single"
            {...register("mode")}
            className="h-4 w-4"
          />
          Single URL
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="bulk"
            {...register("mode")}
            className="h-4 w-4"
          />
          Bulk URLs
        </label>
      </div>

      {mode === "single" ? (
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            Website URL
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            {...register("url", {
              required: mode === "single" ? "URL is required" : false,
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                message: "Please enter a valid URL",
              },
            })}
            className={`w-full ${errors.url ? "border-red-500" : ""}`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
          )}
        </div>
      ) : (
        <div>
          <label htmlFor="urls" className="block text-sm font-medium mb-1">
            Multiple URLs (one per line)
          </label>
          <Textarea
            id="urls"
            placeholder={`https://example.com\nhttps://example.org\nhttps://example.net`}
            {...register("urls", {
              required:
                mode === "bulk" ? "At least one URL is required" : false,
              validate: (value) => {
                if (mode !== "bulk") return true;
                const urls = value
                  .split("\n")
                  .filter((url) => url.trim().length > 0);
                return urls.length > 0 || "At least one URL is required";
              },
            })}
            className={`min-h-[120px] ${errors.urls ? "border-red-500" : ""}`}
          />
          {errors.urls && (
            <p className="mt-1 text-sm text-red-500">{errors.urls.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter one URL per line (max 20 URLs)
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader size="small" />
        ) : mode === "single" ? (
          "Scrape Website"
        ) : (
          "Scrape All URLs"
        )}
      </Button>
    </form>
  );
};

export default ScraperForm;
