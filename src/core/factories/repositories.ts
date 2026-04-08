import type { TodoRepository } from "../repositories/todos";
import { InMemoryTodoRepository } from "../repositories/todos/in-memory-todo-repository";

let todoRepository: TodoRepository | null = null;

export function makeTodoRepository(): TodoRepository {
  if (!todoRepository) {
    todoRepository = new InMemoryTodoRepository();
  }
  return todoRepository;
}
