import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Auth } from "../utils/auth";
import logger from "../utils/logger";

// Secreto utilizado para firmar el token
// TODO: Remplazar token por un usuario
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Middleware de autenticación
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // El token JWT suele estar en el header 'Authorization: Bearer <token>'

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const response = await Auth.check(token);

    if (response.message === Auth.code.CHECK_FAILED) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Agregar el user_id al cuerpo de la solicitud
    req.body.user_id = response.id;

    // Continuar al siguiente middleware o manejador de ruta
    next();
  } catch (error) {
    logger.error("Auth middleware error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default authMiddleware;
