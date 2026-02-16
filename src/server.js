import mongoose from "mongoose";
import { env } from "./config/env.js";
import { createApp } from "./app/app.js";

const app = createApp(env);

async function start() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");

  await mongoose.connect(env.MONGO_URI);
  console.log("DB Connected!");

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Startup error:", err.message);
  process.exit();
});
