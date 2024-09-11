import db from "../databases";
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
  };

  private constructor() {}

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public static check(token: string): string {
    const auth = Auth.getInstance();
    //TODO: TIENE que leer la bd decir si existe una sesscion y si existe actualizar la fecha de expirate
    return Auth.code.SESSION_NOT_FOUND;
    return "";
  }

  public static user(token: string): Promise<User | null> | string {
    const auth = Auth.getInstance();
    if (!auth.sessions.has(token)) return Auth.code.SESSION_NOT_FOUND;
    let session = auth.sessions.get(token);
    const response = session?.userID ? db?.getUser(session.userID) : null;
    if (response) {
    }
    return user ? response.user : Auth.code.USER_NOT_FOUND;
  }

  public static attempt(email: string, password: string): Session | string {
    const auth = Auth.getInstance();
    //TODO: TERMINAR
    return "";
  }
}
