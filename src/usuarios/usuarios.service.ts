import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';  // Importo la entidad Usuario, que representa a la tabla de usuarios en la base de datos
import { CrearUsuarioDto } from './dto/crear-usuario.dto';  // Importo el DTO para la creación de usuarios
import { ModificarUsuarioDto } from './dto/modificar-usuario.dto';  // Importo el DTO para la modificación de usuarios

@Injectable()
export class UsuariosService {
  // Inyecto el repositorio de la entidad `Usuario` para interactuar con la base de datos
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,  // Este repositorio manejará todas las consultas de la tabla `Usuario`
  ) {}

  // Método para crear un nuevo usuario
  async create(crearUsuarioDto: CrearUsuarioDto, imagenUrl: string): Promise<Usuario> {
    // Uso el método `create` del repositorio para crear un nuevo usuario en memoria
    const nuevoUsuario = this.usuariosRepository.create({
      ...crearUsuarioDto,  // Asigno los valores del DTO (nombre, apellido, etc.)
      imagenUrl,  // Asigno el nombre de la imagen que se subió, si existe
    });

    // Luego guardo el usuario en la base de datos usando el método `save`
    return await this.usuariosRepository.save(nuevoUsuario);
  }

  // Método para obtener todos los usuarios
  async obtenerUsuarios(): Promise<Usuario[]> {
    // Uso el método `find` del repositorio para obtener todos los usuarios de la tabla
    return await this.usuariosRepository.find();
  }

  // Método para obtener un usuario por su ID
  async obtenerUsuarioPorId(id: string): Promise<Usuario> {
    // Uso el método `findOne` con el ID del usuario para devolver un solo usuario o `null` si no lo encuentra
    return await this.usuariosRepository.findOne({ where: { id } });
  }

  // Método para modificar un usuario existente
  async modificarUsuario(id: string, modificarUsuarioDto: ModificarUsuarioDto): Promise<Usuario> {
    // Actualizo el usuario en la base de datos utilizando el ID y los nuevos valores del DTO
    await this.usuariosRepository.update(id, modificarUsuarioDto);

    // Después de la actualización, busco el usuario actualizado y lo devuelvo
    return await this.obtenerUsuarioPorId(id);
  }

  // Método para eliminar un usuario (se añadió esta función que faltaba)
  async eliminarUsuario(id: string): Promise<boolean> {
    // Uso el método `delete` del repositorio para eliminar el usuario con el ID dado
    const resultado = await this.usuariosRepository.delete(id);

    // Si `affected` es mayor a 0, significa que se eliminó el usuario correctamente
    return resultado.affected > 0;
  }

  // Método para buscar usuarios por diferentes atributos
  async buscarUsuarios(query: { [key: string]: string }): Promise<Usuario[]> {
    // Creo una consulta dinámica usando el QueryBuilder para buscar usuarios con los atributos dados
    const qb = this.usuariosRepository.createQueryBuilder('usuario');

    // Recorro todos los atributos que se pasan en el query (por ejemplo, nombre o empresa)
    Object.keys(query).forEach((key) => {
      // Agrego una condición a la consulta para cada atributo
      qb.andWhere(`usuario.${key} LIKE :${key}`, { [key]: `%${query[key]}%` });
    });

    // Ejecuto la consulta y devuelvo los resultados
    return await qb.getMany();
  }
}
