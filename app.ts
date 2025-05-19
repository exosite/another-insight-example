import Express from "express";
import morgan from "morgan";
import responseTime from "response-time";
import * as Insight from "./src/insight";

export default function createServer(): Express.Application {
  const app = Express();
  app.use(responseTime());

  app.use(morgan("combined"));

  app.use(Express.json());

  app.get("/api/v1/", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send("ok");
  });

  app.get("/swagger.yaml", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.sendFile("api/swagger.yaml", { root: __dirname });
  });

  app.post("/api/v1/:solution_id", Insight.createSolution);
  app.delete("/api/v1/:solution_id", Insight.delSolution);

  app.get("/api/v1/:solution_id/info", Insight.info);
  app.post("/api/v1/:solution_id/insights", Insight.listInsights);
  app.get("/api/v1/:solution_id/insight/:function_id", Insight.infoInsight);

  app.post("/api/v1/:solution_id/lifecycle", Insight.lifecycle);
  app.post("/api/v1/:solution_id/process", Insight.process);

  return app;
}
