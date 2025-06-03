import { randomBytes } from "crypto";
import loki from "lokijs";
import { TokenRecord } from "../types/index.js";

export class TokenService {
  private db: Loki;
  private tokens: Collection<TokenRecord>;

  constructor() {
    this.db = new loki("tokens.db");
    this.tokens = this.db.addCollection<TokenRecord>("tokens", {
      unique: ["token", "accountNumber"],
    });
  }

  private generateToken(): string {
    return randomBytes(32)
      .toString("base64")
      .replace(/[+/=]/g, "")
      .substring(0, 32);
  }

  async tokenize(accountNumbers: string[]): Promise<string[]> {
    const result: string[] = [];

    for (const accountNumber of accountNumbers) {
      // Check if already tokenized
      const existing = this.tokens.findOne({ accountNumber });

      if (existing) {
        result.push(existing.token);
      } else {
        // Generate new token
        const token = this.generateToken();
        this.tokens.insert({
          token,
          accountNumber,
          createdAt: new Date(),
        });
        result.push(token);
      }
    }

    return result;
  }

  async detokenize(tokens: string[]): Promise<string[]> {
    const result: string[] = [];

    for (const token of tokens) {
      const record = this.tokens.findOne({ token });

      result.push(!record ? "Not found" : record.accountNumber);
    }

    return result;
  }
}
