import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Clientes } from "./Clientes";
import { DetalleFactura } from "./DetalleFactura";

@Entity({ name: "tbFacturas" })
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Clientes, (cliente) => cliente.facturas, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "idCliente" })
  cliente: Clientes;

  @Column({ type: "date", nullable: false })
  fecha: Date;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ type: "timestamp", name: "fecha_creacion" })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: "timestamp", name: "fecha_modificacion" })
  fecha_modificacion: Date;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.factura, {
    cascade: true,
    eager: true,
  })
  detalles: DetalleFactura[];
}
