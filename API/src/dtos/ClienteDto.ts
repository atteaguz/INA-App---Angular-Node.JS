import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
  Matches,
} from "class-validator";

// Devolver un cliente
export class ClienteResponseDto {
  id!: number;
  nombre!: string;
  apellido1!: string;
  apellido2!: string;
  email!: string;
  telefono?: string;
}

// Crear o actualizar un cliente
export class CreateUpdateClienteDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre no debe estar vacío" })
  @MaxLength(100, { message: "El nombre no debe exceder los 100 caracteres" })
  nombre!: string;

  @IsString({ message: "El primer apellido debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El primer apellido no debe estar vacío" })
  @MaxLength(100, {
    message: "El primer apellido no debe exceder los 100 caracteres",
  })
  apellido1!: string;

  @IsString({ message: "El segundo apellido debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El segundo apellido no debe estar vacío" })
  @MaxLength(100, {
    message: "El segundo apellido no debe exceder los 100 caracteres",
  })
  apellido2!: string;

  @IsEmail({}, { message: "El email debe ser una dirección de correo válida" })
  @IsNotEmpty({ message: "El email no debe estar vacío" })
  @MaxLength(300, { message: "El email no debe exceder los 300 caracteres" })
  email!: string;

  @IsOptional()
  @IsString({ message: "El teléfono debe ser una cadena de texto" })
  @MaxLength(20, { message: "El teléfono no debe exceder los 20 caracteres" })
  @Matches(/^[0-9+\-\s()]*$/, {
    message:
      "El teléfono solo puede contener números, +, -, espacios y paréntesis",
  })
  telefono?: string;
}
