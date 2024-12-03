import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración detallada de CORS para el frontend en localhost:3001
  app.enableCors({
    origin: 'http://localhost:3001', // Permite solicitudes desde el puerto del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Habilita el envío de cookies y encabezados de autorización
  });

  // Configuración del puerto
  const PORT = 3000;
  await app.listen(PORT);

 // Logger.log(`NestJS Application is running on: http://localhost:${PORT}`, 'Bootstrap');
}

bootstrap();

