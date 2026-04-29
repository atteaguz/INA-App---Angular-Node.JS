import { Router } from "express";
import ProductoController from "../controllers/ProductosController";
import { validateRequest } from "../middleware/validateRequests";
import { CreateUpdateProductoDto } from "../dtos/ProductoDto";
import { IdParamDto } from "../dtos/IdParamDto";

const ROUTES = Router();

// Definición de rutas para productos - CRUD completo
ROUTES.get("/", ProductoController.getAllProductos);
ROUTES.get(
  "/:id",
  validateRequest({ params: IdParamDto }),
  ProductoController.getProductoById,
);
ROUTES.post(
  "/",
  validateRequest({ body: CreateUpdateProductoDto }),
  ProductoController.createProducto,
);
ROUTES.put(
  "/:id",
  validateRequest({ params: IdParamDto, body: CreateUpdateProductoDto }),
  ProductoController.updateProducto,
);
ROUTES.delete(
  "/:id",
  validateRequest({ params: IdParamDto }),
  ProductoController.deleteProducto,
);

export default ROUTES;
