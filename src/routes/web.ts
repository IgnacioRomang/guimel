import express, { Request, Response } from "express";

const routersWeb = express.Router();

routersWeb.use("/status", (req: Request, res: Response) => {
  res.status(200).send({ message: "OK" });
});

export default routersWeb;
