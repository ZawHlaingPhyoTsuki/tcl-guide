import "varlock/auto-load";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ENV } from "./env.server.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });
  app.enableCors({
    origin: ENV.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  await app.listen(3000);
}
await bootstrap();
