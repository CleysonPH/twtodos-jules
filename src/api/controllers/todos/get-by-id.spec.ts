import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Get Todo By ID (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 404 when the todo does not exist", async () => {
    const response = await request(app.server).get(
      "/api/todos/non-existent-id",
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Todo not found" });
  });

  it("should return the todo when it exists", async () => {
    // Create a new todo first
    const createResponse = await request(app.server)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "Test description" });

    expect(createResponse.status).toBe(201);
    const createdTodo = createResponse.body;

    // Now get the todo by ID
    const getResponse = await request(app.server).get(
      `/api/todos/${createdTodo.id}`,
    );
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(createdTodo);
  });
});
