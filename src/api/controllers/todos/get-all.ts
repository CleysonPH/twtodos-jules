import { makeTodoRepository } from "@/core/factories/repositories";

export async function getAll() {
  const todoRepository = makeTodoRepository();
  return await todoRepository.getAll();
}
