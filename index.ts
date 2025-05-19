import log from "loglevel";
import app from "./app";

log.setLevel(
  (process.env.LOG_LEVEL as unknown as log.LogLevelDesc) || log.levels.TRACE
);
const port = process.env.PORT || 3000;

let server = app().listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
function gracefullShutdown() {
  log.info("gracefull shutdown");
  server.close(() => {
    log.info("server stopped");
    process.exit(0);
  });
}
process.on("SIGINT", gracefullShutdown);
process.on("SIGTERM", gracefullShutdown);
