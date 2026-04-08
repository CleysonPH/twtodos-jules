import type { Todo } from "@/core/types/todo";
import type { TodoRepository } from "./";
import { randomUUID } from "node:crypto";

export class InMemoryTodoRepository implements TodoRepository {
  public items: Todo[] = [];

  async getById(id: string): Promise<Todo | null> {
    const todo = this.items.find((item) => item.id === id);
    return todo || null;
  }

  async getAll(): Promise<Todo[]> {
    return this.items;
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
