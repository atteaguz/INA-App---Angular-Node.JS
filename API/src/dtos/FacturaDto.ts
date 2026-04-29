import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";

//Devolver una factura
export class FacturaResponseDto {
  id!: number;
  cliente!: { id: number; nombre: string; email: string };
  fecha!: Date;
  estado!: boolean;
  totalFactura!: number;
  detalles!: DetalleFacturaResponseDto[];
}

//Devolver un detalle de factura
export class DetalleFacturaResponseDto {
  idDetalle!: number;
  idFactura!: number;
  producto!: { id: number; nombre: string; precio: number };
  cantidad!: number;
  total!: number;
}

//Crear la factura
export class CreateFacturaDto {
  @IsNumber({}, { message: "El ID del cliente es obligatorio" })
  @IsNotEmpty({ message: "El ID del cliente no debe estar vacío" })
  idCliente!: number;

  @IsOptional()
  @IsDateString({}, { message: "La fecha debe ser una fecha válida" })
  fecha?: Date;

  @IsOptional()
  @IsBoolean({ message: "El estado debe ser un valor booleano" })
  estado?: boolean = true;

  @IsNotEmpty({ message: "Debe incluir al menos un detalle" })
  detalles!: CreateDetalleFacturaDto[];
}

//Crear el detalle de factura
export class CreateDetalleFacturaDto {
  @IsNumber({}, { message: "El ID del producto es obligatorio" })
  @IsNotEmpty({ message: "El ID del producto no debe estar vacío" })
  idProducto!: number;

  @IsNumber({}, { message: "La cantidad debe ser un número" })
  @IsNotEmpty({ message: "La cantidad no debe estar vacía" })
  cantidad!: number;
}