import { makeTodoRepository } from "@/core/factories/repositories";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function setCompleted(request: FastifyRequest, reply: FastifyReply) {
  const paramSchema = z.object({
    id: z.string(),
  });

  const bodySchema = z.object({
    completed: z.boolean(),
  });

  const paramResult = paramSchema.safeParse(request.params);
  const bodyResult = bodySchema.safeParse(request.body);

  if (!paramResult.success || !bodyResult.success) {
    return reply.status(400).send({
      error: !paramResult.success ? "Invalid request parameters" : "Invalid request body",
    });
  }

  const todoRepository = makeTodoRepository();

  const todo = await todoRepository.getById(paramResult.data.id);

  if (!todo) {
    return reply.status(404).send({ error: "Todo not found" });
  }

  todo.completed = bodyResult.data.completed;

  const updatedTodo = await todoRepository.update(paramResult.data.id, todo);

  return reply.send(updatedTodo);
}
