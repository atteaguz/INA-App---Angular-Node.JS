import { Router } from "express";
import auth from "./auth";
import categorias from "./categorias";
import clientes from "./clientes";
import productos from "./productos";
import usuario from "./usuario";
import facturas from "./facturas";

const ROUTES = Router();
ROUTES.use("/auth", auth);
ROUTES.use("/usuarios", usuario);
ROUTES.use("/clientes", clientes);
ROUTES.use("/categorias", categorias);
ROUTES.use("/productos", productos);
ROUTES.use("/facturas", facturas);

export default ROUTES;
