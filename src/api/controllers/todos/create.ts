import { makeTodoRepository } from "@/core/factories/repositories";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });

  const result = bodySchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({ error: "Invalid request body" });
  }

  const todoRepository = makeTodoRepository();

  const newTodo = await todoRepository.create({
    ...result.data,
    completed: false,
  });

  return reply.status(201).send(newTodo);
}
