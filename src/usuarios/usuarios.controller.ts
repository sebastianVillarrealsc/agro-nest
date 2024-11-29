import {
  Controller,
  Post,
  Body,
  Get,
  Param,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly authService: AuthService,
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
   * Autenticación de usuario
   */
  @Post('auth/login')
  async login(@Body() loginData: { email: string; contrasena: string }): Promise<{ token: string; user: Usuario }> {
    const { token, user } = await this.authService.login(loginData);
    return { token, user };
  }

  /**
   * Obtener todos los usuarios (protegido)
   */
 // @UseGuards(JwtAuthGuard)
// @Get()
 // async obtenerUsuarios(): Promise<Usuario[]> {
  //  return this.usuariosService.obtenerUsuarios();
 //}

  /**
   * Obtener un usuario por ID (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obtenerUsuarioPorId(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }

  /**
   * Modificar un usuario (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async modificarUsuario(
    @Param('id') id: string,
    @Body() modificarUsuarioDto: ModificarUsuarioDto,
  ): Promise<Usuario> {
    return this.usuariosService.modificarUsuario(id, modificarUsuarioDto);
  }

  /**
   * Eliminar un usuario (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string): Promise<boolean> {
    return this.usuariosService.eliminarUsuario(id);
  }

  /**
   * Buscar usuarios por atributos (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Get('buscar')
  async buscarUsuarios(@Query() query: { [key: string]: string }): Promise<Usuario[]> {
    return this.usuariosService.buscarUsuarios(query);
  }

  /**
   * Obtener balance de tokens de un usuario (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/balance')
  async obtenerBalance(@Param('id') id: string): Promise<{ balanceTokens: number }> {
    const usuario = await this.usuariosService.obtenerUsuarioPorId(id);
    return { balanceTokens: usuario?.balanceTokens || 0 };
  }

  /**
   * Agregar tokens al balance de un usuario (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/agregar-tokens')
  async agregarTokens(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ): Promise<Usuario> {
    return this.usuariosService.agregarTokens(id, cantidad);
  }

  /**
   * Quitar tokens del balance de un usuario (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/quitar-tokens')
  async quitarTokens(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ): Promise<Usuario> {
    return this.usuariosService.quitarTokens(id, cantidad);
  }

  /**
   * Cambiar el rol de un usuario (protegido)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/rol')
  async cambiarRol(
    @Param('id') id: string,
    @Body('rol') rol: string,
  ): Promise<Usuario> {
    if (!Object.values(RolesPermitidos).includes(rol as RolesPermitidos)) {
      throw new BadRequestException(
        `El rol "${rol}" no es válido. Los roles permitidos son: ${Object.values(RolesPermitidos).join(', ')}`,
      );
    }
    return this.usuariosService.cambiarRol(id, rol as RolesPermitidos);
  }
}
