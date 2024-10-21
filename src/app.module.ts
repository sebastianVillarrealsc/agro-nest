import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';  // Importa el módulo para servir archivos estáticos
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarios/entities/usuario.entity'; // Asegúrate de tener tu entidad Usuario aquí
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Carpeta donde se almacenan las imágenes
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',  // Reemplazar por tus credenciales de MySQL
      password: 'Mario1@', // Reemplazar por tu contraseña de MySQL
      database: 'grupo_agro',
      entities: [Usuario],
      synchronize: true, // No usar en producción
    }),
    UsuariosModule,
  ],
})
export class AppModule {}
