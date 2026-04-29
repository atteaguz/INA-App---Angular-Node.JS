import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { Factura } from "./Factura";

@Entity({ name: "tbClientes" })
export class Clientes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 100, nullable: false })
  apellido1: string;

  @Column({ length: 100, nullable: false })
  apellido2: string;

  @Column({ length: 300, unique: true, nullable: false })
  email: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: "date", nullable: false })
  fecha_creacion: Date;

  @Column({ type: "date", nullable: false })
  fecha_modificacion: Date;

  @OneToMany(() => Factura, (factura) => factura.cliente)
  facturas: Factura[];

  @BeforeInsert()
  setDatesOnInsert() {
    const now = new Date();
    this.fecha_creacion = now;
    this.fecha_modificacion = now;
  }

  @BeforeUpdate()
  setDateOnUpdate() {
    this.fecha_modificacion = new Date();
  }
}
