import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir que el frontend y el backend puedan comunicarse
  app.enableCors();

  // La aplicación escuchará en el puerto 3000
  await app.listen(3000);
  
  console.log('NestJS Application is running on: http://localhost:3000');
}

bootstrap();
