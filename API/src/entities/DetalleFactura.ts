import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Factura } from "./Factura";
import { Productos } from "./Productos";

@Entity({ name: "tbDetalleFactura" })
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  idDetalle: number;

  @PrimaryColumn()
  idFactura: number;

  @ManyToOne(() => Factura, (factura) => factura.detalles, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "idFactura" })
  factura: Factura;

  @ManyToOne(() => Productos, (producto) => producto.detallesFactura, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "idProducto" })
  producto: Productos;

  @Column({ type: "int", nullable: false })
  cantidad: number;

  @Column({
    type: "decimal",
    precision: 50,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  total: number;
}
