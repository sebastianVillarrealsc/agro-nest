import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionesService } from './transacciones.service';
import { TransaccionesController } from './transacciones.controller';
import { Transaccion } from './entities/transaccion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthModule } from '../auth/auth.module'; // Módulo de autenticación

@Module({
  imports: [TypeOrmModule.forFeature([Transaccion, Usuario]),     
  forwardRef(() => AuthModule), // Usar forwardRef para romper la dependencia circular
],
  controllers: [TransaccionesController],
  providers: [TransaccionesService],
  exports: [TransaccionesService],
})
export class TransaccionesModule {}
