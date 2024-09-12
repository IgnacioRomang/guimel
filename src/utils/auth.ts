import { Timestamp } from "firebase/firestore";
import db, { Database } from "../databases";
import { Session } from "../interface/session";
import { User } from "../interface/user";
import Hash from "./hash";
import logger from "./logger";
import jwt from "jsonwebtoken";

export class Auth {
  private static instance: Auth;
  private sessions: Map<string, Session> = new Map();
  private static SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
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

  public static async check(token: string): Promise<string> {
    const auth = Auth.getInstance();
    const thirtyMinutesInMillis = 30 * 60 * 1000;

    let session = auth.sessions.get(token) ?? null;

    if (!session) {
      logger.info("Session don't exist on cache");
      session = await Session.findSession(token);

      if (!session) {
        logger.error("Session don't exist on DB");
        return Auth.code.CHECK_FAILED;
      }
      auth.sessions.set(token, session);
    }

    const timeRemaining = session.expires_at.toMillis() - Date.now();

    if (session.isExpired()) {
      logger.warn("The session expired");
      return Auth.code.CHECK_FAILED;
    }

    if (timeRemaining <= thirtyMinutesInMillis) {
      logger.info("Session timestamp update");
      session.updateExpiresAt();
    }

    return Auth.code.CHECK_SUCCESS;
  }

  public static async attempt(
    name: string,
    password: string
  ): Promise<{ token: string | null; message: string }> {
    const auth = Auth.getInstance();

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
