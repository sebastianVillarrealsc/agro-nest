import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  //await app.listen(3000);
//}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar CORS
  await app.listen(3000);
}

bootstrap();
