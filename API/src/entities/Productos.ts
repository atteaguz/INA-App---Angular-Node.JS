import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { DetalleFactura } from "./DetalleFactura";

@Entity({ name: "tbProductos" })
export class Productos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({
    type: "decimal",
    precision: 50,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  precio: number;

  @Column({ type: "int", nullable: false, default: 0 })
  stock: number;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: "date", nullable: false })
  fecha_creacion: Date;

  @Column({ type: "date", nullable: false })
  fecha_modificacion: Date;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.producto)
  detallesFactura: DetalleFactura[];

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
