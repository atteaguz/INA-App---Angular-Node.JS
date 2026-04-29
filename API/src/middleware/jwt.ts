import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import * as jwt from "jsonwebtoken";

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  //Logica para verificar JWT
  //Obtener el token del header key token
  const token = req.headers["token"] as string | undefined;

  //Verificar si el token existe
  if (!token) {
    return res.status(401).json({ message: "No existe el token" });
  }

  //Verificar y decodificar el token
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    (req as any).userId = decoded.userId;

    //Refrescar token
    const refreshToken = jwt.sign(
      { userId: decoded.userId },
      config.jwtSecret,
      { expiresIn: "30m" },
    );

    //Devolver token por header
    res.setHeader("token", refreshToken);
  } catch (error) {
    return res.status(401).json({ message: "Sin Autorizacion" });
  }

  next();
};
