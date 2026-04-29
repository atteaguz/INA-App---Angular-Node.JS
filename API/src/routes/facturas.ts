import { Router } from "express";
import { FacturaController } from "../controllers/FacturaController";
import { validateRequest } from "../middleware/validateRequests";
import { CreateFacturaDto } from "../dtos/FacturaDto";
import { IdParamDto } from "../dtos/IdParamDto";

const ROUTES = Router();

//Obtener todas las facturas
ROUTES.get("/", FacturaController.getAllFacturas);
//Obtener factura especifica por id
ROUTES.get(
  "/:id",
  validateRequest({ params: IdParamDto }),
  FacturaController.getFacturaById,
);
//Crear nueva factura
ROUTES.post(
  "/",
  validateRequest({ body: CreateFacturaDto }),
  FacturaController.createFactura,
);
//Actualizar factura existente
ROUTES.put(
  "/:id",
  validateRequest({ params: IdParamDto, body: CreateFacturaDto }),
  FacturaController.updateFactura  // <-- NUEVO MÉTODO
);
//Borrado logico de factura
ROUTES.patch(
  "/:id/borrar",
  validateRequest({ params: IdParamDto }),
  FacturaController.borrarFactura,
);

export default ROUTES;
