import { makeTodoRepository } from "@/core/factories/repositories";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const paramSchema = z.object({
    id: z.string(),
  });

  const result = paramSchema.safeParse(request.params);

  if (!result.success) {
    return reply.status(400).send({ error: "Invalid request parameters" });
  }

  const todoRepository = makeTodoRepository();

  const todo = await todoRepository.getById(result.data.id);

  if (!todo) {
    return reply.status(404).send({ error: "Todo not found" });
  }

  return reply.send(todo);
}
