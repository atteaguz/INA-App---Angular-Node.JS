import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export class AuthController {
  //Login
  static login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const repo = AppDataSource.getRepository(Usuario);

      const user = await repo.findOneBy({ username });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Datos incorrectos al autenticarse" });
      }

      if (!user.checkPassword(password)) {
        return res
          .status(401)
          .json({ message: "Datos incorrectos al autenticarse" });
      }

      //Devolver token de sesion
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: "3m" },
      );

      //Devolver token por header
      res.setHeader("token", token);

      //Respuesta en el body
      return res
        .status(200)
        .json({
          token, role:user.role,
          user: {
            id:user.id,
            name: user.username,
            email: user.username
          },
        });
    } catch (error) {
      return res.status(500).json({ message: "Error al autenticarse" });
    }
  };
}
