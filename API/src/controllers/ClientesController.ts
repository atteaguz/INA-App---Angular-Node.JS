import { Request, Response } from "express";
import { Clientes } from "../entities/Clientes";
import { AppDataSource } from "../data-source";
import { ClienteMapper } from "../mappers/ClientesMapper";

class ClienteController {
  // Métodos del controlador para manejar clientes

  static getAllClientes = async (req: Request, res: Response) => {
    try {
      // Acceder a la base de datos y obtener los clientes
      const repo = AppDataSource.getRepository(Clientes);

      // Obtener solo los clientes activos
      const listaClientes = await repo.find({ where: { estado: true } });

      // Verificar si hay clientes, de lo contrario enviar un 404
      if (listaClientes.length === 0) {
        return res.status(404).json({ message: "No hay clientes registrados" });
      }

      // Enviar la lista de clientes como respuesta
      return res
        .status(200)
        .json(ClienteMapper.toResponseDtoList(listaClientes));

      // Manejo de errores
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener los clientes" });
    }
  };

  static getClienteById = async (req: Request, res: Response) => {
    try {
      // Destructurizar el id de los parámetros
      const { id } = req.params;

      // Acceder al repositorio de clientes
      const repo = AppDataSource.getRepository(Clientes);
      // Buscar el cliente por id y estado activo
      const cliente = await repo.findOneBy({ id: Number(id), estado: true });

      // Verificar si el cliente existe
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      // Enviar el cliente como respuesta
      return res.status(200).json(ClienteMapper.toResponseDto(cliente));
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el cliente" });
    }
  };

  static createCliente = async (req: Request, res: Response) => {
    try {
      // Obtener los datos del cuerpo de la solicitud
      const { nombre, apellido1, apellido2, email, telefono } = req.body;

      // Reglas de negocio: el email debe ser único
      const repo = AppDataSource.getRepository(Clientes);
      const clienteExistente = await repo.findOneBy({
        email: email,
        estado: true,
      });
      if (clienteExistente) {
        return res
          .status(400)
          .json({ message: "Ya existe un cliente con ese email" });
      }

      // Crear una nueva instancia de Cliente
      const nuevoCliente = repo.create({
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        email: email,
        telefono: telefono || null,
        estado: true,
      });

      // Las fechas se establecerán automáticamente con los @BeforeInsert

      // Guardar el nuevo cliente en la base de datos
      await repo.save(nuevoCliente);
      return res.status(201).json(ClienteMapper.toResponseDto(nuevoCliente));
    } catch (error) {
      return res.status(500).json({ message: "Error al crear el cliente" });
    }
  };

  static updateCliente = async (req: Request, res: Response) => {
    try {
      // Destructurizar el id de los parámetros
      const { id } = req.params;
      const { nombre, apellido1, apellido2, email, telefono } = req.body;

      // Acceder al repositorio de clientes
      const repo = AppDataSource.getRepository(Clientes);
      const cliente = await repo.findOneBy({ id: Number(id) });

      // Verificar si el cliente existe
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Regla de negocio: el email debe ser único (excepto para el mismo cliente)
      if (email !== cliente.email) {
        const clienteExistente = await repo.findOneBy({
          email: email,
          estado: true,
        });
        if (clienteExistente) {
          return res
            .status(400)
            .json({ message: "Ya existe un cliente con ese email" });
        }
      }

      // Actualizar los campos del cliente
      cliente.nombre = nombre;
      cliente.apellido1 = apellido1;
      cliente.apellido2 = apellido2;
      cliente.email = email;
      cliente.telefono = telefono || null;

      // La fecha_modificacion se actualizará automáticamente con @BeforeUpdate

      // Guardar los cambios en la base de datos
      await repo.save(cliente);

      // Enviar el cliente actualizado como respuesta
      return res.status(200).json(ClienteMapper.toResponseDto(cliente));
    } catch (error) {
      return res.status(500).json({ message: "Error al modificar el cliente" });
    }
  };

  static deleteCliente = async (req: Request, res: Response) => {
    try {
      // Destructurizar el id de los parámetros
      const { id } = req.params;

      // Acceder al repositorio de clientes
      const repo = AppDataSource.getRepository(Clientes);
      const cliente = await repo.findOneBy({ id: Number(id) });

      // Verificar si el cliente existe
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Eliminar el cliente (establecer estado a falso)
      cliente.estado = false;

      // Guardar los cambios en la base de datos
      await repo.save(cliente);

      // Enviar respuesta de éxito
      return res
        .status(200)
        .json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar el cliente" });
    }
  };
}

export default ClienteController;
