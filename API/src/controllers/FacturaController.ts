import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Factura } from "../entities/Factura";
import { DetalleFactura } from "../entities/DetalleFactura";
import { Clientes } from "../entities/Clientes";
import { Productos } from "../entities/Productos";
import { FacturaMapper } from "../mappers/FacturaMapper";

export class FacturaController {
  // Obtener todas las facturas
  static getAllFacturas = async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Factura);

      // Cargar todas las relaciones necesarias
      const facturas = await repo.find({
        where: { estado: true },
        relations: ["cliente", "detalles", "detalles.producto"],
        order: {
          fecha: "DESC",
          id: "DESC",
        },
      });

      if (facturas.length === 0) {
        console.log("No hay facturas registradas");
        return res.status(404).json({ message: "No hay facturas registradas" });
      }

      return res.status(200).json(FacturaMapper.toResponseDtoList(facturas));
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      return res.status(500).json({
        message: "Error al obtener las facturas",
      });
    }
  };

  // Obtener factura por ID
  static getFacturaById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID de factura inválido" });
      }

      const repo = AppDataSource.getRepository(Factura);
      const factura = await repo.findOne({
        where: { id: Number(id), estado: true },
        relations: ["cliente", "detalles", "detalles.producto"],
      });

      if (!factura) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      return res.status(200).json(FacturaMapper.toResponseDto(factura));
    } catch (error) {
      console.error("Error al obtener factura por ID:", error);
      return res.status(500).json({
        message: "Error al obtener la factura",
      });
    }
  };

  // Crear una factura con sus detalles
  static createFactura = async (req: Request, res: Response) => {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      const { idCliente, fecha, estado, detalles } = req.body;

      // Validaciones básicas
      if (!idCliente || isNaN(Number(idCliente))) {
        return res.status(400).json({ message: "ID de cliente inválido" });
      }

      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({
          message: "Debe incluir al menos un detalle de producto",
        });
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Verificar que el cliente existe
      const clienteRepo = queryRunner.manager.getRepository(Clientes);
      const cliente = await clienteRepo.findOneBy({
        id: Number(idCliente),
        estado: true,
      });

      if (!cliente) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Crear la factura
      const facturaRepo = queryRunner.manager.getRepository(Factura);
      const nuevaFactura = facturaRepo.create({
        cliente,
        fecha: fecha ? new Date(fecha) : new Date(),
        estado: estado !== undefined ? estado : true,
      });

      // Guardar la factura para obtener el ID
      const facturaGuardada = await queryRunner.manager.save(nuevaFactura);

      // Procesar cada detalle
      const detallesFactura: DetalleFactura[] = [];
      const productoRepo = queryRunner.manager.getRepository(Productos);
      const detalleRepo = queryRunner.manager.getRepository(DetalleFactura);

      for (const detalleData of detalles) {
        const { idProducto, cantidad } = detalleData;

        // Validar detalle
        if (!idProducto || isNaN(Number(idProducto))) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            message: `ID de producto inválido en detalle`,
          });
        }

        if (!cantidad || cantidad <= 0) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            message: `La cantidad debe ser mayor a 0`,
          });
        }

        // Verificar que el producto existe y tiene stock
        const producto = await productoRepo.findOneBy({
          id: Number(idProducto),
          estado: true,
        });

        if (!producto) {
          await queryRunner.rollbackTransaction();
          return res.status(404).json({
            message: `Producto con ID ${idProducto} no encontrado`,
          });
        }

        if (producto.stock < cantidad) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            message: `Stock insuficiente para el producto: ${producto.nombre}`,
          });
        }

        // Calcular total del detalle
        const total = Number(producto.precio) * cantidad;

        // Crear detalle de factura
        const nuevoDetalle = detalleRepo.create({
          factura: facturaGuardada,
          producto,
          cantidad,
          total,
        });

        // Reducir stock del producto
        producto.stock -= cantidad;
        await queryRunner.manager.save(producto);

        // Guardar detalle
        const detalleGuardado = await queryRunner.manager.save(nuevoDetalle);
        detallesFactura.push(detalleGuardado);
      }

      // Asociar detalles a la factura
      facturaGuardada.detalles = detallesFactura;

      // Commit de la transacción
      await queryRunner.commitTransaction();

      // Obtener la factura completa con relaciones
      const facturaCompleta = await AppDataSource.getRepository(
        Factura,
      ).findOne({
        where: { id: facturaGuardada.id },
        relations: ["cliente", "detalles", "detalles.producto"],
      });

      return res
        .status(201)
        .json(FacturaMapper.toResponseDto(facturaCompleta!));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error al crear factura:", error);
      return res.status(500).json({ message: "Error al crear la factura" });
    } finally {
      await queryRunner.release();
    }
  };

//Modificar factura y sus detalles
static updateFactura = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    const { id } = req.params;
    const { idCliente, fecha, estado, detalles } = req.body;

    //Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "ID de factura inválido" });
    }

    //Validar que la factura exista
    const facturaRepo = queryRunner.manager.getRepository(Factura);
    const facturaExistente = await facturaRepo.findOne({
      where: { id: Number(id) },
      relations: ["cliente", "detalles", "detalles.producto"]
    });

    if (!facturaExistente) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    if (!facturaExistente.estado) {
      return res.status(400).json({ message: "No se puede modificar una factura anulada" });
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    //Aqui se actualiza el encabezado de la factura
    if (idCliente && !isNaN(Number(idCliente))) {
      const clienteRepo = queryRunner.manager.getRepository(Clientes);
      const cliente = await clienteRepo.findOneBy({ id: Number(idCliente), estado: true });
      if (!cliente) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      facturaExistente.cliente = cliente;
    }

    if (fecha) {
      facturaExistente.fecha = new Date(fecha);
    }

    if (estado !== undefined) {
      facturaExistente.estado = estado;
    }

    await queryRunner.manager.save(facturaExistente);

    //Se actualizan los datos
    if (detalles && Array.isArray(detalles)) {
      //Se restaura el stock
      for (const detalleAntiguo of facturaExistente.detalles) {
        const producto = detalleAntiguo.producto;
        producto.stock += detalleAntiguo.cantidad;
        await queryRunner.manager.save(producto);
      }

      //Se eliminan los detalles antiguos
      const detalleRepo = queryRunner.manager.getRepository(DetalleFactura);
      await detalleRepo.delete({ idFactura: facturaExistente.id });

      //Se crean los nuevos detalles
      const nuevosDetalles: DetalleFactura[] = [];
      const productoRepo = queryRunner.manager.getRepository(Productos);

      for (const detalleData of detalles) {
        const { idProducto, cantidad } = detalleData;

        //Validaciones
        if (!idProducto || isNaN(Number(idProducto))) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({ message: "ID de producto inválido" });
        }

        if (!cantidad || cantidad <= 0) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
        }

        //Se verifican los productos y el stock
        const producto = await productoRepo.findOneBy({ id: Number(idProducto), estado: true });
        if (!producto) {
          await queryRunner.rollbackTransaction();
          return res.status(404).json({ message: `Producto con ID ${idProducto} no encontrado` });
        }

        if (producto.stock < cantidad) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({ message: `Stock insuficiente para el producto: ${producto.nombre}` });
        }

        //Calculo del total
        const total = Number(producto.precio) * cantidad;

        //Aqui se crea el nuevo detalle
        const nuevoDetalle = new DetalleFactura();
        nuevoDetalle.factura = facturaExistente;
        nuevoDetalle.producto = producto;
        nuevoDetalle.cantidad = cantidad;
        nuevoDetalle.total = total;

        //Se resta el stock
        producto.stock -= cantidad;
        await queryRunner.manager.save(producto);

        const detalleGuardado = await queryRunner.manager.save(nuevoDetalle);
        nuevosDetalles.push(detalleGuardado);
      }
      facturaExistente.detalles = nuevosDetalles;
    }
    await queryRunner.commitTransaction();

    //Se obtiene la nueva factura
    const facturaActualizada = await AppDataSource.getRepository(Factura).findOne({
      where: { id: facturaExistente.id },
      relations: ["cliente", "detalles", "detalles.producto"]
    });

    //Se retorna la factura actualizada
    return res.status(200).json({
      message: "Factura actualizada exitosamente",
      factura: FacturaMapper.toResponseDto(facturaActualizada!)
    });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al actualizar factura:", error);
    return res.status(500).json({ message: "Error al actualizar la factura" });
  } finally {
    await queryRunner.release();
  }
};

  //Borrar facturas
  static borrarFactura = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID de factura inválido" });
      }

      const repo = AppDataSource.getRepository(Factura);
      const factura = await repo.findOne({
        where: { id: Number(id) },
        relations: ["cliente", "detalles", "detalles.producto"],
      });

      if (!factura) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      if (!factura.estado) {
        return res.status(400).json({ message: "La factura ya fue borrada" });
      }

      //Borrar factura
      factura.estado = false;
      await repo.save(factura);

      return res.status(200).json({
        message: "Factura borrada exitosamente",
        factura: FacturaMapper.toResponseDto(factura),
      });
    } catch (error) {
      console.error("Error al borrar factura:", error);
      return res.status(500).json({ message: "Error al borrar la factura" });
    }
  };
}
