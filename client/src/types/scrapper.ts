export interface ScrapedData {
  id: string;
  url: string;
  data: {
    metadata: {
      title: string;
      description: string;
    };
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
    };
    links: Array<{
      text: string;
      href: string;
    }>;
    images: Array<{
      alt: string;
      src: string;
    }>;
    timestamp: string;
  };
  createdAt: string;
}

export interface ScrapedHistoryItem {
  id: string;
  url: string;
  createdAt: string;
}

export interface ScrapedDataResponse {
  data: ScrapedData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
