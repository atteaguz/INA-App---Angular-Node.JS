import {
  FacturaResponseDto,
  DetalleFacturaResponseDto,
} from "../dtos/FacturaDto";
import { Factura } from "../entities/Factura";
import { DetalleFactura } from "../entities/DetalleFactura";

export class FacturaMapper {
  // Método privado para detalles
  private static mapDetalle(
    detalle: DetalleFactura,
  ): DetalleFacturaResponseDto {
    return {
      idDetalle: detalle.idDetalle,
      idFactura: detalle.idFactura,
      producto: {
        id: detalle.producto?.id || 0,
        nombre: detalle.producto?.nombre || "Producto no disponible",
        precio: detalle.producto ? Number(detalle.producto.precio) : 0,
      },
      cantidad: detalle.cantidad,
      total: Number(detalle.total),
    };
  }

  // Método público para factura
  static toResponseDto(factura: Factura): FacturaResponseDto {
    const detalles = factura.detalles || [];

    const totalFactura = detalles.reduce(
      (total, detalle) => total + Number(detalle.total || 0),
      0,
    );

    return {
      id: factura.id,
      cliente: {
        id: factura.cliente?.id || 0,
        nombre: factura.cliente
          ? `${factura.cliente.nombre} ${factura.cliente.apellido1}`.trim()
          : "Cliente no disponible",
        email: factura.cliente?.email || "",
      },
      fecha: factura.fecha,
      estado: factura.estado,
      totalFactura,
      detalles: detalles.map(FacturaMapper.mapDetalle),
    };
  }

  // Método público para lista de facturas
  static toResponseDtoList(facturas: Factura[]): FacturaResponseDto[] {
    return facturas.map(FacturaMapper.toResponseDto);
  }
}
