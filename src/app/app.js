import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { AppError } from "../utils/AppError.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import productRoutes from "../modules/product/product.routes.js";

export function createApp(env) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN === "*" ? true : env.CLIENT_ORIGIN }));
  app.use(express.json());
  app.use(morgan("dev"));

  // Routes
  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.use("/api/v1/products", productRoutes);

  // 404 handler
  app.use((req, res, next) => {
    next(new AppError("Not found", 404));
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
