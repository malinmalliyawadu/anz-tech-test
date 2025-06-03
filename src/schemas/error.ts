import z from "zod";

export const errorSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
});
