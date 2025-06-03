import request from "supertest";
import { FastifyInstance } from "fastify";
import fastify from "../../src/index";

describe("/tokenize endpoint", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should tokenize account numbers", async () => {
    const response = await request(app.server)
      .post("/tokenize")
      .send(["4111-1111-1111-1111"])
      .expect(200);

    expect(response.body).toHaveLength(1);
  });

  it("should return same token for duplicate account numbers in single request", async () => {
    const response = await request(app.server)
      .post("/tokenize")
      .send(["4111-1111-1111-1111", "4111-1111-1111-1111"])
      .expect(200);

    const tokens: string[] = response.body;

    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toBe(tokens[1]);
  });

  it("should maintain idempotency across separate requests", async () => {
    const accountNumber: string = "5555-5555-5555-5555";

    // First request
    const response1 = await request(app.server)
      .post("/tokenize")
      .send([accountNumber])
      .expect(200);

    // Second request
    const response2 = await request(app.server)
      .post("/tokenize")
      .send([accountNumber])
      .expect(200);

    const tokens1: string[] = response1.body;
    const tokens2: string[] = response2.body;

    expect(tokens1[0]).toBe(tokens2[0]);
  });

  it("should handle empty array", async () => {
    const response = await request(app.server)
      .post("/tokenize")
      .send([])
      .expect(200);

    const tokens: string[] = response.body;
    expect(tokens).toEqual([]);
  });

  it("should return 400 for null input", async () => {
    const response = await request(app.server)
      .post("/tokenize")
      .send(null as unknown as any)
      .expect(400);

    expect(response.body.error).toBe("Bad Request");
  });
});
