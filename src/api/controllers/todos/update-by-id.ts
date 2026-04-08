import { makeTodoRepository } from "@/core/factories/repositories";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateById(request: FastifyRequest, reply: FastifyReply) {
  const paramSchema = z.object({
    id: z.string(),
  });

  const bodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });

  const paramResult = paramSchema.safeParse(request.params);
  const bodyResult = bodySchema.safeParse(request.body);

  if (!paramResult.success) {
    return reply.status(400).send({ error: "Invalid request parameters" });
  }

  if (!bodyResult.success) {
    return reply.status(400).send({ error: "Invalid request body" });
  }

  const todoRepository = makeTodoRepository();

  let todo = await todoRepository.getById(paramResult.data.id);

  if (!todo) {
    return reply.status(404).send({ error: "Todo not found" });
  }

  todo.title = bodyResult.data.title;
  todo.description = bodyResult.data.description;

  const updatedTodo = await todoRepository.update(paramResult.data.id, todo);

  return reply.send(updatedTodo);
}
