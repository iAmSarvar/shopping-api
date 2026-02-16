import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export function createApp(env) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN === "*" ? true : env.CLIENT_ORIGIN }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  return app;
}
