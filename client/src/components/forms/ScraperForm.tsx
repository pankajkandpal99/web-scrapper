import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader } from "../general/Loader";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { scrapeWebsite } from "../../features/scrapper/scrapper.slice";

interface ScrapeFormValues {
  url: string;
}

const ScraperForm = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.scrapper);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ScrapeFormValues>();

  const onSubmit = async (data: ScrapeFormValues) => {
    await dispatch(scrapeWebsite(data.url));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1">
          Website URL
        </label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          {...register("url", { required: "URL is required" })}
          className={`w-full ${errors.url ? "border-red-500" : ""}`}
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        {loading ? <Loader size="small" /> : "Scrape Website"}
      </Button>
    </form>
  );
};

export default ScraperForm;
