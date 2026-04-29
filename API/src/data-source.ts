import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario";
import { Clientes } from "./entities/Clientes";
import { Productos } from "./entities/Productos";
import { Categorias } from "./entities/Categorias";
import { Factura } from "./entities/Factura";
import { DetalleFactura } from "./entities/DetalleFactura";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234", // ajusta
  database: "miappdb", // crea esta DB
  synchronize: false, // true: solo para crear entidades en DB, false: durante modificaciones en codigo y pruebas
  logging: false,
  entities: [Usuario, Clientes, Productos, Categorias, Factura, DetalleFactura], //Entidades a crear en la BD
});
