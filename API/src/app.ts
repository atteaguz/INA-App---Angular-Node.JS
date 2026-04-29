import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./data-source";
import routes from "./routes";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    const app: Application = express();
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use("/api", routes);
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
