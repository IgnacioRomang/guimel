import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Secreto utilizado para firmar el token
// TODO: Remplazar token por un usuario
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Middleware de autenticación
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // El token JWT suele estar en el header 'Authorization: Bearer <token>'

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Guardar la información del token en el objeto req
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default authMiddleware;
