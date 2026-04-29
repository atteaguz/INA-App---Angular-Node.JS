import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";

export const checkRole = (rolesPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Obtener del request el id del usuario
    const userId = (req as any).userId;

    //Validar el user id
    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const repo = AppDataSource.getRepository(Usuario);
    const user = await repo.findOneBy({ id: userId });

    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!rolesPermitidos.includes(user.role)) {
      return res.status(401).json({ message: "No autorizado" });
    }

    next();
  };
};
