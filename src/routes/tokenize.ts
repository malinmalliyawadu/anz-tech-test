import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { TokenService } from "../services/tokenService.js";
import { errorSchema } from "../schemas/error.js";

export const registerTokenizeRoute = (
  fastify: FastifyInstance,
  tokenService: TokenService
) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    url: "/tokenize",
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
          error: "Request body must be an array of account numbers",
          statusCode: 400,
        });
      }
    },

    handler: async (request, reply) => {
      try {
        const accountNumbers = request.body;
        fastify.log.info(`Tokenizing ${accountNumbers.length} account numbers`);

        const tokens = await tokenService.tokenize(accountNumbers);

        fastify.log.info(`Successfully generated ${tokens.length} tokens`);
        return reply.code(200).send(tokens);
      } catch (error) {
        fastify.log.error(`Tokenization error: ${error}`);

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        return reply.code(500).send({
          error: `Tokenization failed: ${errorMessage}`,
          statusCode: 500,
        });
      }
    },
  });
};
