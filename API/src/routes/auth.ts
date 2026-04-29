import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateRequest } from "../middleware/validateRequests";
import { loginDto } from "../dtos/LoginDto";

const ROUTES = Router();

ROUTES.post(
  "/login",
  validateRequest({ body: loginDto }),
  AuthController.login,
);

export default ROUTES;
