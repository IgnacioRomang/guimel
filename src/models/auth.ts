import { Session } from "../interface/auth";
import { User } from "../interface/user";

export enum ErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  INVALID_INPUT = "INVALID_INPUT",
}

class Auth {
  private static instance: Auth;
  private sessions: Map<string, Session> = new Map(); // a modo de cache

  private constructor() {}

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public static check(token: string): boolean {
    const auth = Auth.getInstance();
    return auth.sessions.has(token);
  }

  public static user(token: string): Session | ErrorCode | null {
    const auth = Auth.getInstance();
    if (!auth.sessions.has(token)) return ErrorCode.SESSION_NOT_FOUND;
    let user = auth.sessions.get(token);
    return auth.sessions.get(token);
  }

  public static attempt(email: string, password: string): Session | null {
    const auth = Auth.getInstance();
    for (const session of auth.sessions.values()) {
      if (session.user.email === email && session.user.password === password) {
        return session;
      }
    }
  }
}
