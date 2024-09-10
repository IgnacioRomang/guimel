import { Session } from "../interface/auth";
import { User } from "../interface/user";

class Auth {
  private static instance: Auth;
  private sessions: Map<string, User> = new Map();

  private constructor() {}

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public static check(token: string) {
    const auth = Auth.getInstance();
    return auth.sessions.get(token);
  }
}
