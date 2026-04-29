import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class loginDto {
  @IsEmail({}, { message: "Datos incorrectos al autenticarse" })
  @IsNotEmpty({ message: "Datos incorrectos al autenticarse" })
  username: string;

  @IsNotEmpty({ message: "Datos incorrectos al autenticarse" })
  password: string;
}
