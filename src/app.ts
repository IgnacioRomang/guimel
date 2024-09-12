import express from "express";
import cors from "cors";
import morgan from "morgan";
import routers from "./routes";
import logger from "./utils/logger";
import middlewares from "./middleware";

const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
// Middleware
app.use(middlewares.authMiddleware);

//Routes
app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Server running on port " + PORT);
});
