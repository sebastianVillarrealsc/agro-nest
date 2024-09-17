import { Injectable } from '@nestjs/common';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ModificarUsuarioDto } from './dto/modificar-usuario.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsuariosService {
  private readonly rutaDatos = path.join(__dirname, '../../data/usuarios.json');

  // Leer los datos desde el archivo JSON
  private leerDatos(): any[] {
    const datos = fs.readFileSync(this.rutaDatos, 'utf-8');
    return JSON.parse(datos);
  }

  // Escribir datos en el archivo JSON
  private escribirDatos(datos: any[]): void {
    fs.writeFileSync(this.rutaDatos, JSON.stringify(datos, null, 2), 'utf-8');
  }

  // Crear un nuevo usuario
  crearUsuario(crearUsuarioDto: CrearUsuarioDto): any {
    const usuarios = this.leerDatos();
    const nuevoUsuario = { id: Date.now().toString(), ...crearUsuarioDto };
    usuarios.push(nuevoUsuario);
    this.escribirDatos(usuarios);
    return nuevoUsuario;
  }

  // Obtener todos los usuarios
  obtenerUsuarios(): any[] {
    return this.leerDatos();
  }

  // Obtener un usuario por ID
  obtenerUsuarioPorId(id: string): any {
    const usuarios = this.leerDatos();
    return usuarios.find(usuario => usuario.id === id);
  }

  // Modificar un usuario existente
  modificarUsuario(id: string, modificarUsuarioDto: ModificarUsuarioDto): any {
    const usuarios = this.leerDatos();
    const index = usuarios.findIndex(usuario => usuario.id === id);
    if (index === -1) return null;

    usuarios[index] = { ...usuarios[index], ...modificarUsuarioDto };
    this.escribirDatos(usuarios);
    return usuarios[index];
  }

  // Eliminar un usuario
  eliminarUsuario(id: string): boolean {
    const usuarios = this.leerDatos();
    const index = usuarios.findIndex(usuario => usuario.id === id);
    if (index === -1) return false;

    usuarios.splice(index, 1);
    this.escribirDatos(usuarios);
    return true;
  }

  // Buscar usuarios por diferentes atributos
  buscarUsuarios(query: { [key: string]: string }): any[] {
    const usuarios = this.leerDatos();
    return usuarios.filter(usuario => {
      return Object.keys(query).every(key => {
        return usuario[key] && usuario[key].toLowerCase().includes(query[key].toLowerCase());
      });
    });
  }
}
