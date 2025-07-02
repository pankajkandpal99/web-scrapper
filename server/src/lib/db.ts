import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

const connectionConfigs = {
  development: {
    url: env.DATABASE_URL,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    },
  },
  production: {
    url: env.DATABASE_URL,
    options: {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
      ssl: true,
      authSource: "admin",
      // directConnection: true,
    },
  },
  test: {
    url: env.DATABASE_URL,
    options: {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    },
  },
};

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private retryCount = 0;
  private maxRetries = 3;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private setupEventListeners(): void {
    mongoose.connection.on("connected", () => {
      logger.info(
        `MongoDB connected successfully in ${env.NODE_ENV} environment`
      );
      this.retryCount = 0;
    });

    mongoose.connection.on("error", (error) => {
      logger.error(`MongoDB connection error in ${env.NODE_ENV} environment:`, {
        message: error.message,
        stack: error.stack,
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn(`MongoDB disconnected in ${env.NODE_ENV} environment`);
      this.handleReconnection();
    });
  }

  private async handleReconnection(): Promise<void> {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(5000 * this.retryCount, 30000);

      logger.info(
        `Attempting MongoDB reconnection (attempt ${this.retryCount})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      try {
        await this.connect();
      } catch (error) {
        if (this.retryCount < this.maxRetries) {
          await this.handleReconnection();
        } else {
          logger.error("Maximum MongoDB reconnection attempts reached");
          throw error;
        }
      }
    }
  }

  public async connect(): Promise<void> {
    const config =
      connectionConfigs[env.NODE_ENV as keyof typeof connectionConfigs];

    if (!config) {
      throw new Error(`Unsupported environment: ${env.NODE_ENV}`);
    }

    try {
      if (!config.url) {
        throw new Error("Database URL is not defined");
      }
      await mongoose.disconnect().catch(() => {});
      mongoose.connection.on("connecting", () =>
        logger.info("MongoDB connecting...")
      );
      mongoose.connection.on("reconnected", () =>
        logger.info("MongoDB reconnected")
      );

      await mongoose.connect(config.url, {
        ...config.options,
        autoIndex: env.NODE_ENV !== "production",
        bufferCommands: false,
        heartbeatFrequencyMS: 10000,
        maxIdleTimeMS: 30000,
      });

      // Optional: Log connection details securely
      logger.info(`Database connection established`, {
        environment: env.NODE_ENV,
        host: mongoose.connection.host,
      });
    } catch (error) {
      logger.error("Failed to connect to MongoDB", {
        environment: env.NODE_ENV,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info(
        `MongoDB disconnected gracefully from ${env.NODE_ENV} environment`
      );
    } catch (error) {
      logger.error("Error during MongoDB disconnection", {
        environment: env.NODE_ENV,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      process.exit(1);
    }
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export const databaseConnection = DatabaseConnection.getInstance();
