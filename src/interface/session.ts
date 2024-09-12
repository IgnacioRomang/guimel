import { Timestamp } from "firebase/firestore";
import { User } from "./user";
import db from "../databases";

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
    this.created_at = created_at !== undefined ? created_at : Timestamp.fromDate(today);
    this.updated_at = updated_at !== undefined ? updated_at : null;
    this.expires_at = expires_at !== undefined ? expires_at : Timestamp.fromDate(new Date(today.getTime() + Session.ttl * 1000));
  }

  // Método para actualizar la fecha de expiración
  public async updateExpiresAt(): Promise<void> {
    this.expires_at = Timestamp.fromMillis(Date.now() + Session.ttl * 1000);
    this.updated_at = Timestamp.now(); // También actualizamos el 'updated_at'
    await db?.updateSession(this.token, { expires_at: this.expires_at });
  }

  // Método para verificar si la sesión ha expirado
  public isExpired(): boolean {
    return this.expires_at.toMillis() < Date.now();
  }

  public async save() {
    await db?.saveSession(this);
  }

  public async user() {
    return await db?.getUser(this.userID);
  }

  public static async getSession(token: string) {
    return await db?.getSession(token);
  }

  public map(): SessionMap {
    return {
      userID: this.userID,
      token: this.token,
      created_at: this.created_at,
      updated_at: this.updated_at,
      expires_at: this.expires_at,
    } as SessionMap
  };
}


export interface SessionDatabaseInterface {
  saveSession(sessionToSave: Session): Promise<{ session: Session | null, message: string }>;
  getSession(token: string): Promise<{ session: Session | null, message: string }>;
  deleteSession(token: string): Promise<{ message: string }>;
  updateSession(token: string, data: Record<string, any>): Promise<{ message: string }>;
}
