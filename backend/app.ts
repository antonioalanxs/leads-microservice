import express from "express";
import morgan from "morgan";

import { corsMiddleware } from "./middlewares/cors.middleware";
import { authenticationRouter } from "./routes/authentication.routes";
import { leadRouter } from "./routes/lead.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import "./cron-jobs/lead-synchronization.cron-job";

export const app = express();

app.use(morgan("dev"));
app.use(corsMiddleware());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/authentication", authenticationRouter);
app.use("/leads", leadRouter);

app.use(errorMiddleware);
