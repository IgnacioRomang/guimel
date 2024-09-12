import { Timestamp } from "firebase/firestore";
import db, { Database } from "../databases";

export interface UserToSave {
  name: string;
  password: string;
}
import { v4 as uuidv4 } from "uuid";
import Hash from "../utils/hash";

export interface UserDatabaseInterface {
  saveUser(
    userToSave: UserToSave
  ): Promise<{ user: User | null; message: string }>;
  getUser(id: string): Promise<{ user: User | null; message: string }>;
  getUserByName(
    username: string
  ): Promise<{ user: User | null; message: string }>;
  deleteUser(id: string): Promise<{ message: string }>;
}

interface UserMap {
  ID: string;
  name: string;
  password: string;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export class User {
  public ID: string;
  public name: string;
  public password: string;
  public created_at: Timestamp;
  public updated_at: Timestamp | null;

  private constructor(
    name: string,
    password: string,
    id?: string,
    created_at?: Timestamp,
    updated_at?: Timestamp | null
  ) {
    this.ID = id !== undefined ? id : "";
    this.name = name;
    this.password = password;
    this.created_at =
      created_at !== undefined ? created_at : Timestamp.fromDate(new Date());
    this.updated_at = updated_at !== undefined ? updated_at : null;
  }

  //Static
  public static async create(
    name: string,
    password: string,
    id?: string,
    created_at?: Timestamp,
    updated_at?: Timestamp | null
  ): Promise<User> {
    if (created_at == undefined && id == undefined) {
      // si no tiene el created_at y
      const hashedPassword = await Hash.make(password);
      return new User(name, hashedPassword, id, created_at, updated_at);
    }
    return new User(name, password, id, created_at, updated_at);
  }

  public static async findByName(name: string): Promise<User | null> {
    const dbResponse = await db?.getUserByName(name);
    if (
      !dbResponse ||
      dbResponse.message == Database.code.NOT_FOUND ||
      dbResponse.message == Database.code.FAILED
    ) {
      return null;
    }
    return dbResponse.user;
  }

  public static async findById(id: string): Promise<User | null> {
    const dbResponse = await db?.getUser(id);
    if (
      !dbResponse ||
      dbResponse.message == Database.code.NOT_FOUND ||
      dbResponse.message == Database.code.FAILED
    ) {
      return null;
    }
    return dbResponse.user;
  }
  // Métodos
  public async save(): Promise<void> {
    await db?.saveUser(this);
  }

  public makeUUID(): void {
    this.ID = uuidv4();
  }

  public map(): UserMap {
    return {
      ID: this.ID,
      name: this.name,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as UserMap;
  }
}
