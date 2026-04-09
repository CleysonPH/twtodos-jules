import type { Todo } from "@/core/types/todo";
import type { TodoRepository } from "./";
import { randomUUID } from "node:crypto";
import type { PaginatedResponse } from "@/core/types/pagination";

export class InMemoryTodoRepository implements TodoRepository {
  public items: Todo[] = [];

  async getById(id: string): Promise<Todo | null> {
    const todo = this.items.find((item) => item.id === id);
    return todo || null;
  }

  async getAll(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Todo>> {
    const page = params?.page || 1;
    const size = params?.size || 20;

    const start = (page - 1) * size;
    const end = start + size;

    const items = this.items.slice(start, end);

    return {
      items,
      page,
      size,
      total: this.items.length,
    };
  }

  async create(todo: Omit<Todo, "id">): Promise<Todo> {
    const newTodo: Todo = {
      id: randomUUID(),
      ...todo,
    };

    this.items.push(newTodo);

    return newTodo;
  }

  async update(id: string, todo: Omit<Todo, "id">): Promise<Todo | null> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const updatedTodo: Todo = {
      id,
      ...todo,
    };

    this.items[index] = updatedTodo;

    return updatedTodo;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
  }
}
