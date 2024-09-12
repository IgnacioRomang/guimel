import {
  Session,
  SessionDatabaseInterface,

} from "../interface/session";
import { User, UserDatabaseInterface, UserToSave } from "../interface/user";
import { FirebaseDatabase } from "./firebase";

export abstract class Database
  implements UserDatabaseInterface, SessionDatabaseInterface {
  public static code = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    NOT_FOUND: "NOT_FOUND",
    INVALID_INPUT: "INVALID_INPUT",
    DB_ERROR: "DB_ERROR",
  };
  // START Metodos de UserDatabaseInterface
  public abstract saveUser(
    userToSave: UserToSave
  ): Promise<{ user: User | null; message: string }>;
  public abstract getUser(
    id: string
  ): Promise<{ user: User | null; message: string }>;
  public abstract deleteUser(id: string): Promise<{ message: string }>;
  // END Metodos de UserDatabaseInterface

  // START Metodos de SessionDatabaseInterface
  public abstract saveSession(sessionToSave: Session): Promise<{ session: Session | null, message: string }>;
  public abstract getSession(token: string): Promise<{ session: Session | null, message: string }>;
  public abstract deleteSession(token: string): Promise<{ message: string }>;
  public abstract updateSession(token: string, data: Record<string, any>): Promise<{ message: string }>;
  // END Metodos de SessionDatabaseInterface
}
const databaseType = process.env.DB_TYPE || "firebase"; // Opción por defecto

let db: Database | undefined = undefined;

switch (databaseType) {
  case "firebase":
    db = FirebaseDatabase.getInstance();
    break;
  case "sql":
    //db = new SQLDatabase(); // Asegúrate de tener la implementación SQL
    break;
  case "mongodb":
    //db = new MongoDBDatabase(); // Asegúrate de tener la implementación MongoDB
    break;
  default:
    throw new Error(`Unsupported database type: ${databaseType}`);
}

export default db;
