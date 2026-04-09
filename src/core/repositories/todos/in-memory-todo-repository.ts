import type { Todo } from "@/core/types/todo";
import type { TodoRepository } from "./";
import { randomUUID } from "node:crypto";
import type { PaginatedResponse } from "@/core/types/pagination";

export class InMemoryTodoRepository implements TodoRepository {
  /**
   * Internal Map for O(1) lookups by ID.
   */
  private _items = new Map<string, Todo>();

  /**
   * Maintains backward compatibility for external access to the items list.
   * Note: This is an O(n) operation as it converts the Map to an Array.
   */
  public get items(): Todo[] {
    return Array.from(this._items.values());
  }

  /**
   * Optimizes retrieval by ID using a Map lookup.
   * Impact: Reduces time complexity from O(n) to O(1).
   */
  async getById(id: string): Promise<Todo | null> {
    const todo = this._items.get(id);
    return todo || null;
  }

  /**
   * Retrieves a paginated list of todos.
   * Impact: Uses an iterator-based approach to avoid full array allocation if the requested size is small.
   */
  async getAll(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Todo>> {
    const page = params?.page || 1;
    const size = params?.size || 20;

    const start = (page - 1) * size;

    const items: Todo[] = [];
    const iterator = this._items.values();

    // Skip items before the current page
    for (let i = 0; i < start; i++) {
      if (iterator.next().done) break;
    }

    // Collect items for the current page
    for (let i = 0; i < size; i++) {
      const next = iterator.next();
      if (next.done) break;
      items.push(next.value);
    }

    return {
      items,
      page,
      size,
      total: this._items.size,
    };
  }

  /**
   * Creates a new todo and adds it to the Map.
   * Impact: O(1) insertion.
   */
  async create(todo: Omit<Todo, "id">): Promise<Todo> {
    const newTodo: Todo = {
      id: randomUUID(),
      ...todo,
    };

    this._items.set(newTodo.id, newTodo);

    return newTodo;
  }

  /**
   * Updates an existing todo in the Map.
   * Impact: Reduces time complexity from O(n) to O(1).
   */
  async update(id: string, todo: Omit<Todo, "id">): Promise<Todo | null> {
    if (!this._items.has(id)) {
      return null;
    }

    const updatedTodo: Todo = {
      id,
      ...todo,
    };

    this._items.set(id, updatedTodo);

    return updatedTodo;
  }

  /**
   * Deletes a todo from the Map.
   * Impact: Reduces time complexity from O(n) to O(1).
   */
  async delete(id: string): Promise<void> {
    this._items.delete(id);
  }
}
