import type { FastifyInstance } from "fastify";
import { ping } from "./ping";

export async function pingRoutes(app: FastifyInstance) {
  app.get("", ping);
}
