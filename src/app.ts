import express from "express";
import cors from "cors";
import morgan from "morgan";
import routers from "./routes";
import logger from "./logs/logger";

const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Server running on port " + PORT);
});
