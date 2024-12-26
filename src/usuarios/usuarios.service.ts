import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolesPermitidos } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ModificarUsuarioDto } from './dto/modificar-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  /**
   * Crear un nuevo usuario
   */
  async create(
    crearUsuarioDto: CrearUsuarioDto,
    imagenUrl: string,
  ): Promise<Usuario> {
    await this.verificarEmailUnico(crearUsuarioDto.email);

    const hashedPassword = await this.hashPassword(crearUsuarioDto.contrasena);

    const nuevoUsuario = this.usuariosRepository.create({
      ...crearUsuarioDto,
      contrasena: hashedPassword,
      imagenUrl,
      balanceTokens: 0,
      rol: RolesPermitidos.ProveedorInsumos,
    });

    return await this.usuariosRepository.save(nuevoUsuario);
  }

  /**
   * Validar credenciales de usuario
   */
  async validarCredenciales(
    email: string,
    contrasena: string,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
      throw new BadRequestException('Correo o contraseña incorrectos.');
    }
    return usuario;
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  /**
   * Obtener un usuario por su ID
   */
  async obtenerUsuarioPorId(id: string): Promise<Usuario> {
    console.log (id)
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario no encontrado. Mierda ${id}`);
    }
    return usuario;
  }

  /**
   * Modificar un usuario existente
   */
  async modificarUsuario(
    id: string,
    modificarUsuarioDto: ModificarUsuarioDto,
  ): Promise<Usuario> {
    await this.obtenerUsuarioPorId(id);

    if (modificarUsuarioDto.contrasena) {
      modificarUsuarioDto.contrasena = await this.hashPassword(
        modificarUsuarioDto.contrasena,
      );
    }

    await this.usuariosRepository.update(id, { ...modificarUsuarioDto });
    return this.obtenerUsuarioPorId(id);
  }

  /**
   * Eliminar un usuario por su ID
   */
  async eliminarUsuario(id: string): Promise<boolean> {
    const usuario = await this.obtenerUsuarioPorId(id);
    const resultado = await this.usuariosRepository.delete(usuario.id);
    return resultado.affected > 0;
  }

  /**
   * Buscar usuarios por atributos
   */
  async buscarUsuarios(query: { [key: string]: string }): Promise<Usuario[]> {
    const qb = this.usuariosRepository.createQueryBuilder('usuario');
    Object.entries(query).forEach(([key, value]) => {
      qb.andWhere(`usuario.${key} LIKE :${key}`, { [key]: `%${value}%` });
    });
    return qb.getMany();
  }

  /**
   * Incrementar tokens
   */
  async agregarTokens(id: string, cantidad: number): Promise<Usuario> {
    const usuario = await this.obtenerUsuarioPorId(id);
    usuario.balanceTokens += cantidad;
    return this.usuariosRepository.save(usuario);
  }

  /**
   * Decrementar tokens
   */
  async quitarTokens(id: string, cantidad: number): Promise<Usuario> {
    const usuario = await this.obtenerUsuarioPorId(id);
    if (usuario.balanceTokens < cantidad) {
      throw new BadRequestException('Balance insuficiente.');
    }
    usuario.balanceTokens -= cantidad;
    return this.usuariosRepository.save(usuario);
  }

  /**
   * Cambiar el rol de un usuario
   */
  async cambiarRol(id: string, nuevoRol: RolesPermitidos): Promise<Usuario> {
    const usuario = await this.obtenerUsuarioPorId(id);

    if (!Object.values(RolesPermitidos).includes(nuevoRol)) {
      throw new BadRequestException(
        `El rol "${nuevoRol}" no es válido. Roles permitidos: ${Object.values(
          RolesPermitidos,
        ).join(', ')}`,
      );
    }
    

    usuario.rol = nuevoRol;
    return this.usuariosRepository.save(usuario);
  }

  /**
   * Método privado para verificar si el email ya está registrado
   */
  private async verificarEmailUnico(email: string): Promise<void> {
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { email },
    });
    if (usuarioExistente) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }
  }

  /**
   * Método privado para hashear contraseñas
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  async filtrarPorCiudad(ciudad: string): Promise<Usuario[]> {
    return this.usuariosRepository.createQueryBuilder('usuario')
      .where('usuario.ciudad LIKE :ciudad', { ciudad: `%${ciudad}%` })
      .getMany();
  }
   /**
   * Obtener usuarios por rol (proveedor o cliente)
   */
   async obtenerUsuariosPorRol(rol: RolesPermitidos): Promise<Usuario[]> {
    return this.usuariosRepository.find({ where: { rol } });
  }

  /**
   * Asociar un producto a un proveedor
   */
  async agregarProductoAProveedor(id: string, productoDto: any): Promise<any> {
    const usuario = await this.obtenerUsuarioPorId(id);

    if (usuario.rol !== RolesPermitidos.ProveedorInsumos) {
      throw new BadRequestException('El usuario no es un proveedor.');
    }

    // Aquí se debería manejar la lógica para guardar el producto
    // Esto podría incluir un repositorio de productos relacionado con el usuario
    const producto = {
      ...productoDto,
      proveedorId: id,
    };
    // Simulación de guardado (reemplazar con lógica real)
    return producto; // Placeholder
  }

  /**
   * Obtener productos de un proveedor
   */
  async obtenerProductosDeProveedor(id: string): Promise<any[]> {
    const usuario = await this.obtenerUsuarioPorId(id);

    if (usuario.rol !== RolesPermitidos.ProveedorInsumos) {
      throw new BadRequestException('El usuario no es un proveedor.');
    }

    // Aquí se debería manejar la lógica para obtener los productos
    // Simulación de productos asociados al proveedor
    const productos = [
      { id: 1, nombre: 'Producto 1', proveedorId: id },
      { id: 2, nombre: 'Producto 2', proveedorId: id },
    ];
    return productos; // Placeholder
  }

  /**
   * Buscar usuarios con filtros avanzados
   */
  async buscarUsuariosAvanzado(query: { [key: string]: string }): Promise<Usuario[]> {
    const qb = this.usuariosRepository.createQueryBuilder('usuario');

    // Agregar filtros según el query recibido
    if (query.rol) {
      qb.andWhere('usuario.rol = :rol', { rol: query.rol });
    }
    if (query.ciudad) {
      qb.andWhere('usuario.ciudad LIKE :ciudad', { ciudad: `%${query.ciudad}%` });
    }
    if (query.servicio) {
      qb.andWhere('usuario.servicio LIKE :servicio', { servicio: `%${query.servicio}%` });
    }

    return qb.getMany();
  }
  async buscarPorCategoria(servicio: string, ubicacion: string): Promise<Usuario[]> {
    const usuarios = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .where('LOWER(usuario.servicioOfrecido) LIKE :servicio', { servicio: `%${servicio.toLowerCase()}%` })
      .getMany();
  
    if (ubicacion) {
      // Simulación: Ordenar usuarios por distancia. Implementar lógica real si tienes datos geográficos.
      usuarios.sort((a, b) => {
        const distanciaA = this.calcularDistancia(ubicacion, a.ciudad);
        const distanciaB = this.calcularDistancia(ubicacion, b.ciudad);
        return distanciaA - distanciaB;
      });
    }
  
    return usuarios;
  }
  
  private calcularDistancia(ubicacionUsuario: string, ubicacionOtro: string): number {
    // Implementa una función real de cálculo de distancia aquí.
    // Por ahora, simulamos con valores aleatorios.
    return Math.random() * 100; // Simulación
  }
  
}
  
  

