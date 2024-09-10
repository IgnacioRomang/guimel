import express from "express";

const routers = express.Router();

routers.use("/api", routers);

export default routers;
