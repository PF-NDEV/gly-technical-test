import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { dataSource } from "../config/dataSource";
import { AppModule } from "./app.module";

async function bootstrap() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });
  await app.listen(3000);
}
Logger.log(`Server running on http://localhost:3000`, "Bootstrap");
bootstrap();
