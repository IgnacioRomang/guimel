import dotenv from 'dotenv';
//import * as path from 'path';
//const envFilePath = path.resolve(__dirname, './config/.env.development'); // Ajusta la ruta según el entorno
dotenv.config(); //{ path: envFilePath });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import routers from "./routes";
import logger from "./utils/logger";
import middlewares from "./middleware";
import { User } from "./interface/user";


const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
// Middleware
app.use(middlewares.authMiddleware);

//Routes
app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  let user = await User.create("Admin", "Admin");
  user.save();
  logger.info("Server running on port " + PORT);
});
