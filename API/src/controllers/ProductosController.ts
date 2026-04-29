import { Request, Response } from "express";
import { Productos } from "../entities/Productos";
import { AppDataSource } from "../data-source";
import { ProductoMapper } from "../mappers/ProductosMapper";

class ProductoController {
  // Métodos del controlador para manejar productos

  static getAllProductos = async (req: Request, res: Response) => {
    try {
      // Acceder a la base de datos y obtener los productos
      const repo = AppDataSource.getRepository(Productos);

      // Obtener solo los productos activos
      const listaProductos = await repo.find({ where: { estado: true } });

      // Verificar si hay productos, de lo contrario enviar un 404
      if (listaProductos.length === 0) {
        return res
          .status(404)
          .json({ message: "No hay productos registrados" });
      }

      // Enviar la lista de productos como respuesta
      return res
        .status(200)
        .json(ProductoMapper.toResponseDtoList(listaProductos));

      // Manejo de errores
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener los productos" });
    }
  };

  static getProductoById = async (req: Request, res: Response) => {
    try {
      // Destructurizar el id de los parámetros
      const { id } = req.params;

      // Acceder al repositorio de productos
      const repo = AppDataSource.getRepository(Productos);
      // Buscar el producto por id y estado activo
      const producto = await repo.findOneBy({ id: Number(id), estado: true });

      // Verificar si el producto existe
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      // Enviar el producto como respuesta
      return res.status(200).json(ProductoMapper.toResponseDto(producto));
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el producto" });
    }
  };

  static createProducto = async (req: Request, res: Response) => {
    try {
      // Obtener los datos del cuerpo de la solicitud
      const { nombre, precio, stock } = req.body;

      // Reglas de negocio: el nombre debe ser único
      const repo = AppDataSource.getRepository(Productos);
      const productoExistente = await repo.findOneBy({
        nombre: nombre,
        estado: true,
      });
      if (productoExistente) {
        return res
          .status(400)
          .json({ message: "Ya existe un producto con ese nombre" });
      }

      // Crear una nueva instancia de Producto
      const nuevoProducto = repo.create({
        nombre: nombre,
        precio: Number(precio),
        stock: Math.floor(Number(stock)), // Asegurar que sea entero
        estado: true,
      });

      // Las fechas se establecerán automáticamente con los @BeforeInsert

      // Guardar el nuevo producto en la base de datos
      await repo.save(nuevoProducto);
      return res.status(201).json(ProductoMapper.toResponseDto(nuevoProducto));
    } catch (error) {
      return res.status(500).json({ message: "Error al crear el producto" });
    }
  };

  static updateProducto = async (req: Request, res: Response) => {
    try {
      // Destructurizar el id de los parámetros
      const { id } = req.params;
      const { nombre, precio, stock } = req.body;

      // Acceder al repositorio de productos
      const repo = AppDataSource.getRepository(Productos);
      const producto = await repo.findOneBy({ id: Number(id) });

      // Verificar si el producto existe
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Regla de negocio: el nombre debe ser único (excepto para el mismo producto)
      if (nombre !== producto.nombre) {
        const productoExistente = await repo.findOneBy({
          nombre: nombre,
          estado: true,
        });
        if (productoExistente) {
          return res
            .status(400)
            .json({ message: "Ya existe un producto con ese nombre" });
        }
      }

      // Actualizar los campos del producto
      producto.nombre = nombre;
      producto.precio = Number(precio);
      producto.stock = Math.floor(Number(stock)); // Asegurar que sea entero

      // La fecha_modificacion se actualizará automáticamente con @BeforeUpdate

      // Guardar los cambios en la base de datos
      await repo.save(producto);

      // Enviar el producto actualizado como respuesta
      return res.status(200).json(ProductoMapper.toResponseDto(producto));
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al modificar el producto" });
    }
  };

  static deleteProducto = async (req: Request, res: Response) => {
    try {
      // Destructurizar el id de los parámetros
      const { id } = req.params;

      // Acceder al repositorio de productos
      const repo = AppDataSource.getRepository(Productos);
      const producto = await repo.findOneBy({ id: Number(id) });

      // Verificar si el producto existe
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Eliminar el producto (establecer estado a falso)
      producto.estado = false;

      // Guardar los cambios en la base de datos
      await repo.save(producto);

      // Enviar respuesta de éxito
      return res
        .status(200)
        .json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar el producto" });
    }
  };
}

export default ProductoController;
