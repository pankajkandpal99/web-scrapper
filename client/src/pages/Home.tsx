import {
  Cpu,
  Database,
  Search,
  ChevronRight,
  Globe,
  Code,
  CheckCircle,
  Shield,
  Zap,
  Github,
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 101);
    }, 50);
    return () => clearInterval(progressInterval);
  }, []);

  const coreFeatures = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "Smart URL Detection",
      description:
        "Automatically analyzes website structures with AI-powered pattern recognition",
    },
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: "AI Extraction",
      description:
        "Handles dynamic content and JavaScript-rendered pages efficiently",
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: "Data Export",
      description:
        "Multiple export formats (JSON, CSV, Excel) with custom field selection",
    },
  ];

  const implementationDetails = {
    requirements: [
      "URL validation and sanitization",
      "DOM parsing and data extraction",
      "Error handling and retry logic",
      "Rate limiting and proxy rotation",
    ],
    stack: [
      "React + TypeScript (Frontend)",
      "Node.js + Express (Backend)",
      "Puppeteer for browser automation",
      "Tailwind CSS for styling",
    ],
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse opacity-70"></div>
            <div className="relative bg-primary/10 rounded-full p-5 mx-auto w-24 h-24 flex items-center justify-center">
              <Globe className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Web Scraping Assignment
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Technical demonstration showcasing advanced web scraping
            capabilities for Full Stack Engineer position
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <Badge variant="secondary" className="px-4 py-1.5">
              <CheckCircle className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5">
              <Shield className="w-4 h-4 mr-2" />
              Secure Processing
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5">
              <Zap className="w-4 h-4 mr-2" />
              High Performance
            </Badge>
          </div>

          <div className="bg-card border rounded-xl p-6 max-w-md mx-auto mb-8 mt-16 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Demo Progress</span>
              <span className="font-mono text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">
              Extracting product data from example.com
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 px-8 cursor-pointer"
              onClick={() => {
                try {
                  navigate("/scrape");
                } catch (error) {
                  console.error("Navigation error:", error);
                }
              }}
            >
              Start Scraping
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://github.com/pankajkandpal99/web-scrapper",
                  "_blank"
                )
              }
            >
              <Github className="w-4 h-4" />
              Source Code
            </Button>
          </div>
        </div>
      </section>

      <div className="w-full max-w-6xl mx-auto px-4 py-8 -mt-16 relative z-10">
        <section className="bg-card border rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Core Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-lg border hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Technical Implementation
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-medium text-xl mb-6 flex items-center">
                <ChevronRight className="w-5 h-5 text-primary mr-3" />
                Key Requirements
              </h3>
              <ul className="space-y-4 pl-10">
                {implementationDetails.requirements.map((item, i) => (
                  <li key={i} className="text-muted-foreground text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-xl mb-6 flex items-center">
                <ChevronRight className="w-5 h-5 text-primary mr-3" />
                Technology Stack
              </h3>
              <ul className="space-y-4 pl-10">
                {implementationDetails.stack.map((item, i) => (
                  <li key={i} className="text-muted-foreground text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="gap-2 px-10">
              Explore Implementation
              <Code className="w-5 h-5" />
            </Button>
          </div>
        </section>

        <footer className="py-12 text-center">
          <p className="text-muted-foreground">
            Web Scraping Assignment • Full Stack Engineer Position •{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
