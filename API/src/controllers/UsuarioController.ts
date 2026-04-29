import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { UsuarioMapper } from "../mappers/UsuariosMapper";

export class UsuarioController {

  //Obtener todos los usuarios activos
  static getAllUsuarios = async (req: Request, res: Response) => {
      try {
        //acceder a la base de datos y obtener los usuarios
        const repo = AppDataSource.getRepository(Usuario);
  
        //obtener solo los usuarios activos
        const listaUsuarios = await repo.find({ where: { estado: true } });
  
        //verificar si hay usuarios, de lo contrario enviar un 404
        if (listaUsuarios.length === 0) {
          return res
            .status(404)
            .json({ message: "No hay usuarios registrados" });
        }
  
        //enviar la lista de usuarios como respuesta
        return res
          .status(200)
          .json(UsuarioMapper.toResponseDtoList(listaUsuarios));
  
        //manejo de errores
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error al obtener los usuarios" });
      }
  };

  //Obtener usuarios por id
  static getUsuarioById = async (req: Request, res: Response) => {
    try {
      //DESTRUCTURIZAR EL ID DE LOS PARÁMETROS
      const { id } = req.params;
    
      //acceder al repositorio de usuarios
      const repo = AppDataSource.getRepository(Usuario);
      //buscar el usuario por id y estado activo
      const usuario = await repo.findOneBy({ id: Number(id), estado: true });
    
      //verificar si el usuario existe
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    
      //enviar el usuario como respuesta
      return res.status(200).json(UsuarioMapper.toResponseDto(usuario));
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };

  //Crear usuarios
  static createUsuarios = async (req: Request, res: Response) => {
    try {
      const { username, password, role } = req.body;

      const repo = AppDataSource.getRepository(Usuario);

      const existingUser = await repo.findOneBy({ username: username });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message: "El nombre de usuario (correo electronico) ya existe.",
          });
      }

      const newUser = repo.create({ username, password, role });

      newUser.hashPassword();
      await repo.save(newUser);
      return res.status(201).json({ message: "Usuario creado con exito." });
    } catch (error) {
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
};

//Actualizar usuarios
static updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const repo = AppDataSource.getRepository(Usuario);
    
    // Buscar usuario existente y activo
    const usuario = await repo.findOneBy({ id: Number(id), estado: true });
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar que el nuevo username no pertenezca a otro usuario
    if (username && username !== usuario.username) {
      const existingUser = await repo.findOneBy({ 
        username: username, 
        estado: true 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: "El nombre de usuario (correo electrónico) ya existe." 
        });
      }
      usuario.username = username;
    }

    // Actualizar contraseña solo si se envía una nueva
    if (password) {
      usuario.password = password;
      usuario.hashPassword(); // Volver a encriptar
    }

    // Actualizar rol si se envía
    if (role) {
      usuario.role = role;
    }

    await repo.save(usuario);
    
    //La contraseña no se devuelve en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;
    
    return res.status(200).json({
      message: "Usuario actualizado con éxito",
      user: UsuarioMapper.toResponseDto(usuario)
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

//Borrado logico
static deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const repo = AppDataSource.getRepository(Usuario);
    
    // Buscar usuario existente y activo
    const usuario = await repo.findOneBy({ id: Number(id), estado: true });
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.estado = false;
    await repo.save(usuario);
    
    return res.status(200).json({ 
      message: "Usuario eliminado con éxito." 
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
}
