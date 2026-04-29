import { Router } from "express";
import ClienteController from "../controllers/ClientesController";
import { validateRequest } from "../middleware/validateRequests";
import { CreateUpdateClienteDto } from "../dtos/ClienteDto";
import { IdParamDto } from "../dtos/IdParamDto";

const ROUTES = Router();

//Definición de rutas para clientes - CRUD completo
ROUTES.get("/", ClienteController.getAllClientes);
ROUTES.get(
  "/:id",
  validateRequest({ params: IdParamDto }),
  ClienteController.getClienteById,
);
ROUTES.post(
  "/",
  validateRequest({ body: CreateUpdateClienteDto }),
  ClienteController.createCliente,
);
ROUTES.put(
  "/:id",
  validateRequest({ params: IdParamDto, body: CreateUpdateClienteDto }),
  ClienteController.updateCliente,
);
ROUTES.delete(
  "/:id",
  validateRequest({ params: IdParamDto }),
  ClienteController.deleteCliente,
);

export default ROUTES;
