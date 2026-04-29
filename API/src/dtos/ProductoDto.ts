import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
} from "class-validator";

// Devolver un producto
export class ProductoResponseDto {
  id!: number;
  nombre!: string;
  precio!: number;
  stock!: number;
}

// Crear o actualizar un producto
export class CreateUpdateProductoDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre no debe estar vacío" })
  @MaxLength(100, { message: "El nombre no debe exceder los 100 caracteres" })
  nombre!: string;

  @IsNumber({}, { message: "El precio debe ser un número" })
  @Min(0.01, { message: "El precio debe ser mayor a 0" })
  precio!: number;

  @IsNumber({}, { message: "El stock debe ser un número" })
  @Min(0, { message: "El stock no puede ser negativo" })
  stock!: number;
}
