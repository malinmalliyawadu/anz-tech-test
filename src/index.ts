import Fastify from "fastify";
import { registerHealthRoute } from "./routes/health";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { TokenService } from "./services/tokenService";
import { registerTokenizeRoute } from "./routes/tokenize";
import { registerDetokenizeRoute } from "./routes/detokenize";

const fastify = Fastify({ logger: true });
const tokenService = new TokenService();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

registerHealthRoute(fastify);
registerTokenizeRoute(fastify, tokenService);
registerDetokenizeRoute(fastify, tokenService);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server running. Health check http://localhost:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
