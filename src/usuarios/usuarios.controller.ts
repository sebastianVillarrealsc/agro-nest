import { Controller, Post, Body, Get, Param, Put, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ModificarUsuarioDto } from './dto/modificar-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Función para generar un nombre único para las imágenes subidas
  private static generarNombreImagen(file: Express.Multer.File): string {
    return uuidv4() + extname(file.originalname);  // Generar un nombre único basado en UUID y extensión del archivo
  }

  // Endpoint para subir una imagen y crear un nuevo usuario
  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads',  // Carpeta donde se almacenarán las imágenes
      filename: (req, file, cb) => {
        const nombreImagen = UsuariosController.generarNombreImagen(file);  // Generamos el nombre de la imagen
        cb(null, nombreImagen);  // Guardamos la imagen con el nombre generado
      },
    }),
  }))
  async create(
    @Body() crearUsuarioDto: CrearUsuarioDto,  // Obtenemos los datos del usuario desde el cuerpo de la petición
    @UploadedFile() file: Express.Multer.File,  // Archivo de imagen subido
  ): Promise<Usuario> {
    const imagenUrl = file ? file.filename : null;  // Si se sube una imagen, guardamos su nombre, si no, asignamos null
    return this.usuariosService.create(crearUsuarioDto, imagenUrl);  // Llamamos al servicio para crear el usuario con la imagen
  }

  // Endpoint para obtener todos los usuarios
  @Get()
  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuarios();  // Llamamos al servicio para obtener todos los usuarios
  }

  // Endpoint para obtener un usuario por su ID
  @Get(':id')
  async obtenerUsuarioPorId(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.obtenerUsuarioPorId(id);  // Llamamos al servicio para obtener un usuario por su ID
  }

  // Endpoint para modificar un usuario existente
  @Put(':id')
  async modificarUsuario(
    @Param('id') id: string,  // Obtenemos el ID del usuario que queremos modificar
    @Body() modificarUsuarioDto: ModificarUsuarioDto,  // Obtenemos los nuevos datos del usuario
  ): Promise<Usuario> {
    return this.usuariosService.modificarUsuario(id, modificarUsuarioDto);  // Llamamos al servicio para modificar al usuario
  }

  // Endpoint para eliminar un usuario por su ID
  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string): Promise<boolean> {
    return this.usuariosService.eliminarUsuario(id);  // Llamamos al servicio para eliminar un usuario
  }

  // Endpoint para buscar usuarios por diferentes atributos (nombre, empresa, etc.)
  @Get('buscar')
  async buscarUsuarios(@Query() query: { [key: string]: string }): Promise<Usuario[]> {
    return this.usuariosService.buscarUsuarios(query);  // Llamamos al servicio para buscar usuarios según los atributos que se pasen como parámetros
  }
}
