import { Timestamp } from "firebase/firestore";
import { User } from "./user";
import db, { Database } from "../databases";

interface SessionMap {
  userID: string;
  token: string;
  created_at: Timestamp;
  updated_at: Timestamp | null;
  expires_at: Timestamp;
}

export class Session {
  public userID: string;
  public token: string;
  public created_at: Timestamp;
  public updated_at: Timestamp | null;
  public expires_at: Timestamp;

  private static ttl = process.env.FIREBASE_TTL
    ? Number(process.env.FIREBASE_TTL)
    : 3600;

  constructor(
    userID: string,
    token: string,
    created_at?: Timestamp,
    updated_at?: Timestamp | null,
    expires_at?: Timestamp
  ) {
    let today = new Date();
    const ttl = process.env.FIREBASE_TTL
      ? Number(process.env.FIREBASE_TTL)
      : 3600;

    this.userID = userID;
    this.token = token;
    this.created_at =
      created_at !== undefined ? created_at : Timestamp.fromDate(today);
    this.updated_at = updated_at !== undefined ? updated_at : null;
    this.expires_at =
      expires_at !== undefined
        ? expires_at
        : Timestamp.fromDate(new Date(today.getTime() + Session.ttl * 1000));
  }
  // Staticos
  public static async findSession(token: string): Promise<Session | null> {
    const dbResponse = await db?.getSession(token);
    if (
      !dbResponse ||
      dbResponse.message == Database.code.NOT_FOUND ||
      dbResponse.message == Database.code.FAILED
    ) {
      return null;
    }
    return dbResponse.session;
  }
  // MétodoS
  public async updateExpiresAt(): Promise<void> {
    this.expires_at = Timestamp.fromMillis(Date.now() + Session.ttl * 1000);
    this.updated_at = Timestamp.now(); // También actualizamos el 'updated_at'
    this.token = await db?.updateSession(this.token, {
      expires_at: this.expires_at,
    });
  }

  public isExpired(): boolean {
    return this.expires_at.toMillis() < Date.now();
  }

  public async save() {
    await db?.saveSession(this);
  }

  public map(): SessionMap {
    return {
      userID: this.userID,
      token: this.token,
      created_at: this.created_at,
      updated_at: this.updated_at,
      expires_at: this.expires_at,
    } as SessionMap;
  }
}

export interface SessionDatabaseInterface {
  saveSession(
    sessionToSave: Session
  ): Promise<{ session: Session | null; message: string }>;
  getSession(
    token: string
  ): Promise<{ session: Session | null; message: string }>;
  deleteSession(token: string): Promise<{ message: string }>;
  updateSession(
    token: string,
    data: Record<string, any>
  ): Promise<{ message: string }>;
}
