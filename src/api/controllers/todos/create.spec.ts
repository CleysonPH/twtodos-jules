import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Create Todo (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a new todo", async () => {
    const response = await request(app.server)
      .post("/api/todos")
      .send({ title: "New Todo", description: "Test description" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "New Todo",
        description: "Test description",
        completed: false,
      }),
    );
  });

  it("should return 400 for invalid request body", async () => {
    const response = await request(app.server)
      .post("/api/todos")
      .send({ title: 123 }); // Invalid title

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({ error: "Invalid request body" }),
    );
  });
});
