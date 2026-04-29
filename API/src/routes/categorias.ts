import { Router } from "express";
import CategoriaController from "../controllers/CategoriasController";
import { validateRequest } from "../middleware/validateRequests";
import { createUpdateCategoriaDto } from "../dtos/CategoriaDto";
import { IdParamDto } from "../dtos/IdParamDto";
import { checkJWT } from "../middleware/jwt";
import { checkRole } from "../middleware/role";
import { UserRole } from "../enums/enums";

const ROUTES = Router();

ROUTES.get("/", CategoriaController.getAllCategorias);
ROUTES.get(
  "/:id",
  [
    checkJWT,
    checkRole([UserRole.ADMIN]),
    validateRequest({ params: IdParamDto }),
  ],
  CategoriaController.getCategoriaById,
);
ROUTES.post(
  "/",
  [checkJWT, validateRequest({ body: createUpdateCategoriaDto })],
  CategoriaController.createCategorias,
);
ROUTES.patch(
  "/:id",
  [
    checkJWT,
    validateRequest({ params: IdParamDto, body: createUpdateCategoriaDto }),
  ],
  CategoriaController.updateCategorias,
);

ROUTES.delete(
  "/:id",
  [checkJWT, validateRequest({ params: IdParamDto })],
  CategoriaController.deleteCategorias,
);

export default ROUTES;
