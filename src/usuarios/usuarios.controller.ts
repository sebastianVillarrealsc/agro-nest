import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Request,
  Put,
  Delete,
  Query,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ModificarUsuarioDto } from './dto/modificar-usuario.dto';
import { Usuario, RolesPermitidos } from './entities/usuario.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  // Generar un nombre único para las imágenes subidas
  private static generarNombreImagen(file: Express.Multer.File): string {
    return uuidv4() + extname(file.originalname);
  }

  /**
   * Crear un nuevo usuario
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const nombreImagen = UsuariosController.generarNombreImagen(file);
          cb(null, nombreImagen);
        },
      }),
    }),
  )
  async create(
    @Body() crearUsuarioDto: CrearUsuarioDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Usuario> {
    const imagenUrl = file ? file.filename : null;
    return this.usuariosService.create(crearUsuarioDto, imagenUrl);
  }

  /**
   * Obtener todos los usuarios (protegido)
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuarios();
  }

  /**
   * Obtener un usuario por ID (protegido)
   */
  @Get('one/:id')
  @UseGuards(JwtAuthGuard)
  async obtenerUsuarioPorId(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }

  /**
   * Modificar un usuario (protegido)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async modificarUsuario(
    @Param('id') id: string,
    @Body() modificarUsuarioDto: ModificarUsuarioDto,
  ): Promise<Usuario> {
    return this.usuariosService.modificarUsuario(id, modificarUsuarioDto);
  }
  

  /**
   * Eliminar un usuario (protegido)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async eliminarUsuario(@Param('id') id: string): Promise<boolean> {
    return this.usuariosService.eliminarUsuario(id);
  }

  /**
   * Buscar usuarios con filtros avanzados (protegido)
   */
  @Get('buscar')
  @UseGuards(JwtAuthGuard)
  async buscarUsuarios(@Query() query: { [key: string]: string }): Promise<Usuario[]> {
    return this.usuariosService.buscarUsuariosAvanzado(query);
  }

  /**
   * Obtener balance de tokens de un usuario (protegido)
   */
  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async obtenerBalance(@Request() req): Promise<{ balanceTokens: number }> {
    const userId = req.user.sub;
    const usuario = await this.usuariosService.obtenerUsuarioPorId(userId);
    return { balanceTokens: usuario?.balanceTokens || 0 };
  }

  /**
   * Agregar tokens al balance de un usuario (protegido)
   */
  @Patch(':id/agregar-tokens')
  @UseGuards(JwtAuthGuard)
  async agregarTokens(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ): Promise<Usuario> {
    return this.usuariosService.agregarTokens(id, cantidad);
  }

  /**
   * Quitar tokens del balance de un usuario (protegido)
   */
  @Patch(':id/quitar-tokens')
  @UseGuards(JwtAuthGuard)
  async quitarTokens(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ): Promise<Usuario> {
    return this.usuariosService.quitarTokens(id, cantidad);
  }

  /**
   * Cambiar el rol de un usuario (protegido)
   */
  @Patch(':id/rol')
  @UseGuards(JwtAuthGuard)
  async cambiarRol(
    @Param('id') id: string,
    @Body('rol') rol: RolesPermitidos,
  ): Promise<Usuario> {
    if (!Object.values(RolesPermitidos).includes(rol)) {
      throw new BadRequestException(
        `El rol "${rol}" no es válido. Los roles permitidos son: ${Object.values(RolesPermitidos).join(', ')}`,
      );
    }
    return this.usuariosService.cambiarRol(id, rol);
  }

  /**
   * Filtrar usuarios por ciudad
   */
  @Get('filtrar-por-ciudad')
  async filtrarPorCiudad(@Query('ciudad') ciudad: string): Promise<Usuario[]> {
    if (!ciudad) {
      throw new BadRequestException('Debe proporcionar una ciudad.');
    }
    return this.usuariosService.filtrarPorCiudad(ciudad);
  }

  /**
   * Listar usuarios por rol (Proveedores de Insumos)
   */
  @Get('proveedores-insumos')
  @UseGuards(JwtAuthGuard)
  async listarProveedoresInsumos(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuariosPorRol(RolesPermitidos.ProveedorInsumos);
  }

  /**
   * Listar usuarios por rol (Proveedores de Servicios)
   */
  @Get('proveedores-servicios')
  @UseGuards(JwtAuthGuard)
  async listarProveedoresServicios(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuariosPorRol(RolesPermitidos.ProveedorServicios);
  }

  /**
   * Listar usuarios por rol (Publicidad)
   */
  @Get('publicidad')
  @UseGuards(JwtAuthGuard)
  async listarUsuariosPublicidad(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuariosPorRol(RolesPermitidos.Publicidad);
  }

  /**
   * Listar usuarios por rol (Mecenas)
   */
  @Get('mecenas')
  @UseGuards(JwtAuthGuard)
  async listarUsuariosMecenas(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuariosPorRol(RolesPermitidos.Mecenas);
  }

  /**
   * Asociar un producto a un proveedor
   */
  @Post(':id/agregar-producto')
  @UseGuards(JwtAuthGuard)
  async agregarProducto(
    @Param('id') id: string,
    @Body() productoDto: any,
  ): Promise<any> {
    return this.usuariosService.agregarProductoAProveedor(id, productoDto);
  }

  /**
   * Listar productos de un proveedor
   */
  @Get(':id/productos')
  @UseGuards(JwtAuthGuard)
  async obtenerProductos(@Param('id') id: string): Promise<any[]> {
    return this.usuariosService.obtenerProductosDeProveedor(id);
  }
  
@Get('buscar-por-categoria')
async buscarPorCategoria(
  @Query('servicio') servicio: string,
  @Query('ubicacion') ubicacion?: string, // Opcional
): Promise<Usuario[]> {
  if (!servicio) {
    throw new BadRequestException('Debe proporcionar un servicio.');
  }
  return this.usuariosService.buscarPorCategoria(servicio, ubicacion);
}




}
