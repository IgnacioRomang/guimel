import { Timestamp } from "firebase/firestore";
import db, { Database } from "../databases";
import { Session } from "../interface/session";
import { User } from "../interface/user";

export class Auth {
  private static instance: Auth;
  private sessions: Map<string, Session> = new Map(); // a modo de cache

  public static code = {
    USER_NOT_FOUND: "USER_NOT_FOUND",
    SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
    SESSION_EXPIRED: "SESSION_EXPIRED",
    SESSION_ACTIVE: "SESSION_ACTIVE",
    INVALID_INPUT: "INVALID_INPUT",
    ATTEMPT_SUCCESS: "ATTEMPT_SUCCESS",
    FAILED: "FAILED",
    SUCCESS: "SUCCESS"
  };

  private constructor() { }

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public static async check(token: string): Promise<string> {
    const auth = Auth.getInstance();
    const thirtyMinutesInMillis = 30 * 60 * 1000;

    let session = auth.sessions.get(token);

    if (!session) {
      const dbResponse = await Session.getSession(token);

      if (!dbResponse?.session) {
        return dbResponse?.message === Database.code.NOT_FOUND
          ? Auth.code.SESSION_NOT_FOUND
          : Auth.code.FAILED;
      }
      session = dbResponse.session;
      auth.sessions.set(token, session);
    }

    const timeRemaining = session.expires_at.toMillis() - Date.now();

    if (session.isExpired()) {
      return Auth.code.SESSION_EXPIRED;
    }

    if (timeRemaining <= thirtyMinutesInMillis) {
      session.updateExpiresAt();
    }

    return Auth.code.SESSION_ACTIVE;
  }

  public static async attempt(name: string, password: string): Promise<{ session: Session | null, message: string }> {
    const auth = Auth.getInstance();

    // Verificar credenciales del usuario
    const user = await db?.getUserByEmail(email);
    if (!user) {
      return Auth.code.USER_NOT_FOUND;
    }

    const isPasswordValid = await db?.validatePassword(user, password);
    if (!isPasswordValid) {
      return Auth.code.INVALID_INPUT;
    }

    // Generar un token único para la sesión
    const token = crypto.randomUUID(); // Usar alguna función para generar un token único

    // Crear una nueva sesión
    const session = new Session(user.id, token);
    await session.save();

    // Almacenar la sesión en caché
    auth.sessions.set(token, session);

    return session;
  }

}
