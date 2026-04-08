import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Set Completed Todo (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 404 when the todo does not exist", async () => {
    const response = await request(app.server)
      .patch("/api/todos/non-existent-id/completed")
      .send({ completed: true });
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

    // Now try to set completed with an invalid body
    const updateResponse = await request(app.server)
      .patch(`/api/todos/${createdTodo.id}/completed`)
      .send({ completed: "not-a-boolean" }); // Invalid completed value

    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body).toEqual(
      expect.objectContaining({ error: "Invalid request body" }),
    );
  });

  it("should set the completed status of the todo", async () => {
    // Create a new todo first
    const createResponse = await request(app.server)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "Test description" });

    expect(createResponse.status).toBe(201);
    const createdTodo = createResponse.body;

    // Now set the completed status of the todo
    const updateResponse = await request(app.server)
      .patch(`/api/todos/${createdTodo.id}/completed`)
      .send({ completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createdTodo.id,
        title: createdTodo.title,
        description: createdTodo.description,
        completed: true,
      }),
    );
  });
});
