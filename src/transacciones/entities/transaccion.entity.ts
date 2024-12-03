import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('transacciones')
export class Transaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'varchar' })
  tipo: string; // "compra" o "venta"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number; // Dinero involucrado

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.transacciones, { eager: true })
  usuario: Usuario;
}
