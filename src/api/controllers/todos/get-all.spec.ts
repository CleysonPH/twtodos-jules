import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Get All Todos (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return empty array when there are no todos", async () => {
    const response = await request(app.server).get("/api/todos");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([]));
  });

  it("should return all todos", async () => {
    // Create a new todo first
    await request(app.server)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "Test description" });

    const response = await request(app.server).get("/api/todos");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Test Todo",
        description: "Test description",
        completed: false,
      }),
    );
  });
});
