import type { FastifyInstance } from "fastify";
import { pingRoutes } from "./controllers/ping/routes";
import { todosRoutes } from "./controllers/todos/routes";

export async function apiRoutes(app: FastifyInstance) {
  app.register(pingRoutes, { prefix: "/ping" });
  app.register(todosRoutes, { prefix: "/todos" });
}
