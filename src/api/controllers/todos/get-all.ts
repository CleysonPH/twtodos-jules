import { makeTodoRepository } from "@/core/factories/repositories";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().min(1).optional(),
    size: z.coerce.number().min(1).max(100).optional(),
  });

  const result = querySchema.safeParse(request.query);

  if (!result.success) {
    return reply.status(400).send({
      error: "Invalid query parameters",
      issues: result.error.issues,
    });
  }

  const { page, size } = result.data;

  const todoRepository = makeTodoRepository();
  return await todoRepository.getAll({ page, size });
}
