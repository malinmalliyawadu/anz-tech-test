import { TokenService } from "../../src/services/tokenService";

describe("TokenizationService", () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
  });

  describe("tokenize", () => {
    it("should tokenize a single account number", async () => {
      const accountNumbers: string[] = ["4111-1111-1111-1111"];
      const tokens: string[] = await service.tokenize(accountNumbers);

      expect(tokens).toHaveLength(1);
      expect(typeof tokens[0]).toBe("string");
      expect(tokens[0].length).toBe(32);
    });

    it("should tokenize multiple account numbers", async () => {
      const accountNumbers: string[] = [
        "4111-1111-1111-1111",
        "4444-3333-2222-1111",
        "4444-1111-2222-3333",
      ];
      const tokens: string[] = await service.tokenize(accountNumbers);

      expect(tokens).toHaveLength(3);
      tokens.forEach((token: string) => {
        expect(typeof token).toBe("string");
        expect(token.length).toBe(32);
      });

      // All tokens should be unique
      const uniqueTokens: Set<string> = new Set(tokens);
      expect(uniqueTokens.size).toBe(3);
    });

    it("should return same token for duplicate account numbers", async () => {
      const accountNumbers: string[] = [
        "4111-1111-1111-1111",
        "4111-1111-1111-1111",
      ];
      const tokens: string[] = await service.tokenize(accountNumbers);

      expect(tokens).toHaveLength(2);
      expect(tokens[0]).toBe(tokens[1]);
    });

    it("should handle empty array", async () => {
      const tokens: string[] = await service.tokenize([]);
      expect(tokens).toHaveLength(0);
    });

    it("should maintain consistent tokens across calls", async () => {
      const accountNumber: string = "4111-1111-1111-1111";

      const firstCall: string[] = await service.tokenize([accountNumber]);
      const secondCall: string[] = await service.tokenize([accountNumber]);

      expect(firstCall[0]).toBe(secondCall[0]);
    });

    it("should handle mixed new and existing account numbers", async () => {
      // First tokenize one account number
      const firstTokens: string[] = await service.tokenize([
        "4111-1111-1111-1111",
      ]);

      // Then tokenize a mix of new and existing
      const mixedTokens: string[] = await service.tokenize([
        "4111-1111-1111-1111", // existing
        "4444-3333-2222-1111", // new
      ]);

      expect(mixedTokens[0]).toBe(firstTokens[0]); // Should be same token
      expect(mixedTokens[1]).not.toBe(firstTokens[0]); // Should be different token
    });
  });
});
