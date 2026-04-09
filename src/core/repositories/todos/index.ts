import type { Todo } from "@/core/types/todo";

export interface TodoRepository {
  getById(id: string): Promise<Todo | null>;
  getAll(): Promise<Todo[]>;
  create(todo: Omit<Todo, "id">): Promise<Todo>;
  update(id: string, todo: Omit<Todo, "id">): Promise<Todo | null>;
  delete(id: string): Promise<void>;
}
