import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export interface Session {
  userID: string;
  token: string;
  created_at: Timestamp;
  updated_at: Timestamp | null;
  expires_at: Timestamp;
}

export interface SessionToSave {
  userID: string;
  token: string;
}

export interface SessionDatabaseInterface {
  saveSession(sessionToSave: SessionToSave): Promise<Session>;
  getSession(id: string): Promise<User | void>;
  deleteSession(id: string): Promise<void>;
  updateSession(id: string): Promise<void>;
}
