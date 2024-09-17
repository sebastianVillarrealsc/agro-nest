import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ModificarUsuarioDto } from './dto/modificar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Crear un nuevo usuario
  @Post()
  crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.crearUsuario(crearUsuarioDto);
  }

  // Obtener todos los usuarios
  @Get()
  obtenerUsuarios() {
    return this.usuariosService.obtenerUsuarios();
  }

  // Obtener un usuario por ID
  @Get(':id')
  obtenerUsuarioPorId(@Param('id') id: string) {
    const usuario = this.usuariosService.obtenerUsuarioPorId(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  // Modificar un usuario existente
  @Put(':id')
  modificarUsuario(@Param('id') id: string, @Body() modificarUsuarioDto: ModificarUsuarioDto) {
    const usuarioModificado = this.usuariosService.modificarUsuario(id, modificarUsuarioDto);
    if (!usuarioModificado) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuarioModificado;
  }

  // Eliminar un usuario
  @Delete(':id')
  eliminarUsuario(@Param('id') id: string) {
    const resultado = this.usuariosService.eliminarUsuario(id);
    if (!resultado) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return { mensaje: 'Usuario eliminado correctamente' };
  }

  // Buscar usuarios por diferentes atributos
  @Get('buscar')
  buscarUsuarios(@Query() query: any) {
    const usuariosEncontrados = this.usuariosService.buscarUsuarios(query);
    if (usuariosEncontrados.length === 0) {
      throw new NotFoundException('No se encontraron usuarios con los criterios de búsqueda proporcionados');
    }
    return usuariosEncontrados;
  }
}
