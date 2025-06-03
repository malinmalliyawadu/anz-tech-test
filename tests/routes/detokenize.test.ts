import request from "supertest";
import { FastifyInstance } from "fastify";
import fastify from "../../src/index";

describe("/detokenize endpoint", () => {
  let validTokens: string[];
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Create some tokens to use in tests
    const response = await request(app.server)
      .post("/tokenize")
      .send([
        "4111-1111-1111-1111",
        "4444-3333-2222-1111",
        "4444-1111-2222-3333",
      ]);
    validTokens = response.body;
  });

  it("should detokenize a single token", async () => {
    const response = await request(app.server)
      .post("/detokenize")
      .send([validTokens[0]])
      .expect(200)
      .expect("Content-Type", /json/);

    const accountNumbers: string[] = response.body;

    expect(Array.isArray(accountNumbers)).toBe(true);
    expect(accountNumbers).toHaveLength(1);
    expect(accountNumbers[0]).toBe("4111-1111-1111-1111");
  });

  it("should detokenize multiple tokens", async () => {
    const response = await request(app.server)
      .post("/detokenize")
      .send(validTokens)
      .expect(200);

    const accountNumbers: string[] = response.body;

    expect(accountNumbers).toHaveLength(3);
    expect(accountNumbers).toEqual([
      "4111-1111-1111-1111",
      "4444-3333-2222-1111",
      "4444-1111-2222-3333",
    ]);
  });

  it("should maintain order of tokens", async () => {
    // Use tokens in reverse order
    const reversedTokens: string[] = [...validTokens].reverse();

    const response = await request(app.server)
      .post("/detokenize")
      .send(reversedTokens)
      .expect(200);

    const accountNumbers: string[] = response.body;

    expect(accountNumbers).toEqual([
      "4444-1111-2222-3333",
      "4444-3333-2222-1111",
      "4111-1111-1111-1111",
    ]);
  });

  it("should handle duplicate tokens in request", async () => {
    const response = await request(app.server)
      .post("/detokenize")
      .send([validTokens[0], validTokens[0]])
      .expect(200);

    const accountNumbers: string[] = response.body;

    expect(accountNumbers).toHaveLength(2);
    expect(accountNumbers[0]).toBe(accountNumbers[1]);
    expect(accountNumbers[0]).toBe("4111-1111-1111-1111");
  });

  it("should handle empty array", async () => {
    const response = await request(app.server)
      .post("/detokenize")
      .send([])
      .expect(200);

    const accountNumbers: string[] = response.body;
    expect(accountNumbers).toEqual([]);
  });
});
