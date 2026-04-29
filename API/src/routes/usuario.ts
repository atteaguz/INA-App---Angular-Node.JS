import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { validateRequest } from "../middleware/validateRequests";
import { createUpdateUsuarioDto } from "../dtos/UsuarioDto";
import { checkRole } from "../middleware/role";
import { checkJWT } from "../middleware/jwt";

const ROUTES = Router();

// Obtener todos los usuarios (todos pueden ver)
ROUTES.get(
  "/",
  checkJWT,
  checkRole(["admin","user","guest"]),
  UsuarioController.getAllUsuarios
);

// Obtener usuario por ID (todos pueden ver)
ROUTES.get(
  "/:id",
  checkJWT,
  checkRole(["admin","user","guest"]),
  UsuarioController.getUsuarioById
);

// Crear usuario (solo admin y user)
ROUTES.post(
  "/",
  checkJWT,
  checkRole(["admin","user"]),
  validateRequest({ body: createUpdateUsuarioDto }),
  UsuarioController.createUsuarios
);

// Actualizar usuario (solo admin)
ROUTES.patch(
  "/:id",
  checkJWT,
  checkRole(["admin"]),
  validateRequest({ body: createUpdateUsuarioDto }),
  UsuarioController.updateUsuario
);

// Borrado logico de usuario (solo admin)
ROUTES.delete(
  "/:id",
  checkJWT,
  checkRole(["admin"]),
  UsuarioController.deleteUsuario
);

export default ROUTES;