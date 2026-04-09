import type { Todo } from "@/core/types/todo";
import type { PaginatedResponse } from "@/core/types/pagination";

export interface TodoRepository {
  getById(id: string): Promise<Todo | null>;
  getAll(params?: { page?: number; size?: number }): Promise<PaginatedResponse<Todo>>;
  create(todo: Omit<Todo, "id">): Promise<Todo>;
  update(id: string, todo: Omit<Todo, "id">): Promise<Todo | null>;
  delete(id: string): Promise<void>;
}
