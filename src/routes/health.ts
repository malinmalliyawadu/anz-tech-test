import { type FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const registerHealthRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/health",
    schema: {
      response: {
        200: z.string(),
      },
    },
    handler: (_req, res) => {
      res.send("Healthy");
    },
  });
};
