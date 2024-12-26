import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario, RolesPermitidos } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { ProductoDto } from './dto/producto.dto';



// Ejemplo actualizado con roles válidos:
describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuariosRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuariosRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('debería obtener usuarios por rol', async () => {
    const mockUsuarios = [
      { id: '1', nombre: 'Proveedor 1', rol: RolesPermitidos.ProveedorInsumos },
      { id: '2', nombre: 'Publicidad 1', rol: RolesPermitidos.Publicidad },
    ];
    jest.spyOn(usuariosRepository, 'find').mockResolvedValueOnce(mockUsuarios);

    const proveedores = await service.obtenerUsuariosPorRol(RolesPermitidos.ProveedorInsumos);
    expect(proveedores).toEqual([mockUsuarios[0]]);
  });

  it('debería agregar un producto a un proveedor', async () => {
    const proveedor = { id: '1', rol: RolesPermitidos.ProveedorInsumos } as Usuario;
    jest.spyOn(service, 'obtenerUsuarioPorId').mockResolvedValueOnce(proveedor);

    const productoDto: ProductoDto = {
      nombre: 'Tractor',
      descripcion: 'Tractor nuevo',
      precio: 100000,
      cantidad: 1,
      proveedorId: '1',
    };

    const resultado = await service.agregarProductoAProveedor(proveedor.id, productoDto);
    expect(resultado).toEqual({ ...productoDto });
  });

  it('debería devolver error si un usuario de rol Publicidad intenta agregar un producto', async () => {
    const usuarioPublicidad = { id: '1', rol: RolesPermitidos.Publicidad } as Usuario;
    jest.spyOn(service, 'obtenerUsuarioPorId').mockResolvedValueOnce(usuarioPublicidad);

    const productoDto: ProductoDto = {
      nombre: 'Tractor',
      descripcion: 'Tractor nuevo',
      precio: 100000,
      cantidad: 1,
      proveedorId: '1',
    };

    await expect(
      service.agregarProductoAProveedor(usuarioPublicidad.id, productoDto),
    ).rejects.toThrow('El usuario no es un proveedor.');
  });
});
