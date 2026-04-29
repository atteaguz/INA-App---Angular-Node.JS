import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UserRole } from "../enums/enums";

@Entity({ name: "tbUsuarios" })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false, unique: true })
  username: string;

  @Column({ length: 100, nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    nullable: false,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true, nullable: false })
  estado: boolean;

  //Encriptado de contraseña usando bcryptjs
  //saltRound es la cantidad de ciclos para encriptar la contraseña
  hashPassword(): void {
    const saltRound = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, saltRound);
  }

  //Metodo para verificar contraseñas al momento de login
  checkPassword(unhashedPassword: string): boolean {
    return bcrypt.compareSync(unhashedPassword, this.password);
  }
}
