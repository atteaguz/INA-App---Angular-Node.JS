import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserRole } from "../enums/enums";

//DTO respuesta al usuario
export class UsuarioResponseDto {
  id!: number;
  username!: string;
  role!: string;
  //password!: string; //no se incluye la contraseña en el DTO de respuesta por seguridad
  estado!: boolean;
}

//Validaciones de los campos de usuario con class-validator
export class createUpdateUsuarioDto {
  @MinLength(6, { message: "El usuario debe tener minimo 6 caracteres" })
  @MaxLength(100, { message: "El usuario debe tener maximo 100 caracteres" })
  @IsEmail({}, { message: "El email debe ser valido" })
  @IsNotEmpty({ message: "El username es obligatorio" })
  @IsOptional()
  username?: string;

  @MinLength(6, { message: "La contraseña debe tener minimo 6 caracteres" })
  @MaxLength(100, { message: "La contraseña debe tener maximo 100 caracteres" })
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  @IsOptional()
  password?: string;

  @IsNotEmpty({ message: "El rol es obligatorio" })
  @IsEnum(UserRole, { message: "El rol deber ser valido" })
  @IsOptional()
  role?: UserRole;
}
