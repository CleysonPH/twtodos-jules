import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Update Todo by ID (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 404 when the todo does not exist", async () => {
    const response = await request(app.server)
      .put("/api/todos/non-existent-id")
      .send({ title: "Updated Title", description: "Updated description" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Todo not found" });
  });

  it("should return 400 for invalid request body", async () => {
    // Create a new todo first
    const createResponse = await request(app.server)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "Test description" });

    expect(createResponse.status).toBe(201);
    const createdTodo = createResponse.body;

    // Now try to update the todo with an invalid body
    const updateResponse = await request(app.server)
      .put(`/api/todos/${createdTodo.id}`)
      .send({ title: 123 }); // Invalid title

    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body).toEqual(
      expect.objectContaining({ error: "Invalid request body" }),
    );
  });

  it("should update the todo when it exists", async () => {
    // Create a new todo first
    const createResponse = await request(app.server)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "Test description" });

    expect(createResponse.status).toBe(201);
    const createdTodo = createResponse.body;

    // Now update the todo by ID
    const updateResponse = await request(app.server)
      .put(`/api/todos/${createdTodo.id}`)
      .send({ title: "Updated Title", description: "Updated description" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createdTodo.id,
        title: "Updated Title",
        description: "Updated description",
        completed: false,
      }),
    );
  });
});
