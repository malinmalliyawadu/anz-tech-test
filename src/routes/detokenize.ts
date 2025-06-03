import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { TokenService } from "../services/tokenService";
import { errorSchema } from "../schemas/error";

export const registerDetokenizeRoute = (
  fastify: FastifyInstance,
  tokenService: TokenService
) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    url: "/detokenize",
    method: "POST",
    schema: {
      body: z.array(z.string()),
      response: {
        200: z.array(z.string()),
        500: errorSchema,
      },
    },

    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.body || !Array.isArray(request.body)) {
        return reply.code(400).send({
          error: "Request body must be an array of tokens",
          statusCode: 400,
        });
      }
    },

    handler: async (request, reply) => {
      try {
        const tokens = request.body;

        if (tokens.length === 0) {
          await reply.status(200).send([]);
          return;
        }

        // Detokenize using service
        const accountNumbers = await tokenService.detokenize(tokens);

        await reply.status(200).send(accountNumbers);
        return;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        return reply.code(500).send({
          error: `Detokenization failed: ${errorMessage}`,
          statusCode: 500,
        });
      }
    },
  });
};
