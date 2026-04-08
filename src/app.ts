import fastify from "fastify";
import { apiRoutes } from "./api/routes";
import { env } from "./config/env";

export const app = fastify({
  logger: env.NODE_ENV === "development",
});

app.register(apiRoutes, { prefix: "/api" });
