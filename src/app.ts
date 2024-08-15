import "reflect-metadata";
import "dotenv/config";
import "module-alias/register";

import express from "express";
import http from "http";
import bootstrapApp from "./bootstrap";
import RouteVersion from "@config/route.config";
import routes from "./shared/routes/index.routes";
import logger from "@shared/utils/logger";

class App {
  private app: express.Application;
  private server: http.Server;

  constructor() {
    this.app = express();
    bootstrapApp(this.app);

    this.registerModules();

    this.server = http.createServer(this.app);
  }

  private registerModules() {
    this.app.use(routes.app); // Register your main app routes
    this.app.use(routes.health); // Register health check routes
    this.app.use(RouteVersion.v1, routes.auditTrail);
  }

  public getInstance() {
    return this.app;
  }

  public async close() {
    if (this.server) {
      this.server.close();
    }
  }

  public listen(port: number, address = "0.0.0.0") {
    return this.server.listen(port, address, () => {
      logger.info(`Server listening on ${address}:${port}`);
    });
  }
}

export default App;
