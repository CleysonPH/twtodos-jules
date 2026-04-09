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

  it("should return empty items when there are no todos", async () => {
    const response = await request(app.server).get("/api/todos");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [],
      page: 1,
      size: 20,
      total: 0,
    });
  });

  it("should return paginated todos", async () => {
    // Create a new todo first
    await request(app.server)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "Test description" });

    const response = await request(app.server).get("/api/todos");
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Test Todo",
        description: "Test description",
        completed: false,
      }),
    );
    expect(response.body.page).toBe(1);
    expect(response.body.size).toBe(20);
    expect(response.body.total).toBeGreaterThan(0);
  });

  it("should handle custom pagination parameters", async () => {
    // Create multiple todos
    for (let i = 1; i <= 5; i++) {
      await request(app.server)
        .post("/api/todos")
        .send({ title: `Todo ${i}` });
    }

    const response = await request(app.server).get("/api/todos?page=2&size=2");
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(2);
    expect(response.body.page).toBe(2);
    expect(response.body.size).toBe(2);
    expect(response.body.total).toBeGreaterThanOrEqual(5);
  });

  it("should return 400 for invalid pagination parameters", async () => {
    const response = await request(app.server).get("/api/todos?page=0");
    expect(response.status).toBe(400);
  });
});
