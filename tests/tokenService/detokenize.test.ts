import { TokenService } from "../../src/services/tokenService";

describe("detokenize", () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
  });

  it("should detokenize tokens back to original account numbers", async () => {
    const accountNumbers: string[] = [
      "4111-1111-1111-1111",
      "4444-3333-2222-1111",
      "4444-1111-2222-3333",
    ];

    const tokens: string[] = await service.tokenize(accountNumbers);
    const detokenized: string[] = await service.detokenize(tokens);

    expect(detokenized).toEqual(accountNumbers);
  });

  it("should handle single token", async () => {
    const accountNumbers: string[] = ["4111-1111-1111-1111"];
    const tokens: string[] = await service.tokenize(accountNumbers);
    const detokenized: string[] = await service.detokenize(tokens);

    expect(detokenized).toEqual(accountNumbers);
  });

  it("should handle empty array", async () => {
    const detokenized: string[] = await service.detokenize([]);
    expect(detokenized).toHaveLength(0);
  });

  it("should maintain order of tokens", async () => {
    const accountNumbers: string[] = [
      "4111-1111-1111-1111",
      "4444-3333-2222-1111",
    ];
    const tokens: string[] = await service.tokenize(accountNumbers);

    // Reverse the order of tokens
    const reversedTokens: string[] = [...tokens].reverse();
    const detokenized: string[] = await service.detokenize(reversedTokens);

    // Should return account numbers in the same order as tokens
    expect(detokenized).toEqual([...accountNumbers].reverse());
  });

  it("should return 'Not found' for unknown token", async () => {
    const detokenize = await service.detokenize(["unknown-token-12345"]);
    expect(detokenize).toEqual(["Not found"]);
  });
});
