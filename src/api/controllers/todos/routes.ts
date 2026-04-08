import type { FastifyInstance } from "fastify";
import { getAll } from "./get-all";
import { create } from "./create";
import { getById } from "./get-by-id";
import { deleteById } from "./delete-by-id";
import { updateById } from "./update-by-id";

export async function todosRoutes(app: FastifyInstance) {
  app.get("", getAll);
  app.post("", create);
  app.get("/:id", getById);
  app.delete("/:id", deleteById);
  app.put("/:id", updateById);
}
