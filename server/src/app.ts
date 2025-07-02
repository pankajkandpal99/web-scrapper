import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { databaseConnection } from "./lib/db.js";
import { corsOptions, staticCorsOptions } from "./config/corsOptions.js";
import { contextMiddleware } from "./middleware/context.js";
import { dirname } from "path";
import { env } from "./config/env.js";
import { errorHandler } from "./error-handler/error-handler.js";
import baseRouter from "../src/api/v1/routes/index.js";
import { fileURLToPath } from "url";

export const createApp = async () => {
  const app = express();
  const db = databaseConnection.getConnection();

  // Middlewares
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(helmet());
  app.use(contextMiddleware(db));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // const uploadsPath = path.join(__dirname, "../uploads");
  // app.use(
  //   "/uploads",
  //   cors(staticCorsOptions),
  //   express.static(uploadsPath, {
  //     setHeaders: (res, path) => {
  //       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  //       res.setHeader("Cache-Control", "public, max-age=31536000");
  //     },
  //   })
  // );

  // Routes
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server successfully deployed and running! 🚀",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  app.use("/api/v1", baseRouter);

  app.use(errorHandler as unknown as express.ErrorRequestHandler);
  return app;
};
