import { Timestamp } from "firebase/firestore";
import db, { Database } from "../databases";
import { User } from "../interface/user";
import Hash from "./hash";
import logger from "./logger";
import jwt from "jsonwebtoken";

export class Auth {
  private static instance: Auth;
  private static SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
  private static TTL_AUTH = process.env.TTL_JWT || "2h";
  public static code = {
    CHECK_FAILED: "CHECK_FAILED",
    CHECK_SUCCESS: "CHECK_SUCCESS",
    ATTEMPT_SUCCESS: "ATTEMPT_SUCCESS",
    ATTEMPT_FAILED: "ATTEMPT_FAILED",
    FAILED: "FAILED",
  };

  private constructor() {}

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public static async check(
    token: string
  ): Promise<{ token: string; id: string | null; message: string }> {
    try {
      const decoded = jwt.verify(token, Auth.SECRET_KEY) as jwt.JwtPayload;

      if (!decoded.exp) {
        throw new Error("Token does not have an expiration field.");
      }
      const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
      const currentTime = Date.now();
      const thirtyMinutesInMillis = 30 * 60 * 1000;
      let tokenAux = token;
      // Si quedan menos de 30 minutos para que expire, generar un nuevo token
      if (expirationTime - currentTime < thirtyMinutesInMillis) {
        tokenAux = jwt.sign({ id: decoded.id }, Auth.SECRET_KEY, {
          expiresIn: Auth.TTL_AUTH,
        });
      }
      return {
        token: tokenAux,
        id: decoded.id,
        message: Auth.code.CHECK_SUCCESS,
      };
    } catch (error) {
      logger.error("Auth check error", error);
      return { token: token, id: null, message: Auth.code.CHECK_FAILED };
    }
  }

  public static async attempt(
    name: string,
    password: string
  ): Promise<{ token: string | null; message: string }> {
    const user = await User.findByName(name);
    if (!user) {
      return { token: null, message: Auth.code.ATTEMPT_FAILED };
    }

    const isPasswordValid = Hash.check(password, user.password);
    if (!isPasswordValid) {
      return { token: null, message: Auth.code.ATTEMPT_FAILED };
    }

    const token = jwt.sign({ id: user.ID }, Auth.SECRET_KEY, {
      expiresIn: "2h",
    });

    //const session = new Session(user.ID, token);
    //await session.save();
    //auth.sessions.set(token, session);

    return { token: token, message: Auth.code.ATTEMPT_SUCCESS };
  }
}
