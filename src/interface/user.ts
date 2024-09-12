import db from "../databases";

export interface UserToSave {
  name: string;
  password: string;
}
import { v4 as uuidv4 } from "uuid";

export interface UserDatabaseInterface {
  saveUser(
    userToSave: UserToSave
  ): Promise<{ user: User | null; message: string }>;
  getUser(id: string): Promise<{ user: User | null; message: string }>;
  deleteUser(id: string): Promise<{ message: string }>;
}

interface UserMap {
  ID: string;
  name: string;
  password: string;
}

export class User {
  public ID: string;
  public name: string;
  public password: string;

  constructor(name: string, password: string, id?: string) {
    this.ID = id !== undefined ? id : "";
    this.name = name;
    this.password = password;
  }

  // Método para guardar el usuario en la base de datos
  public async save(): Promise<void> {
    await db?.saveUser(this);
  }

  // Método para obtener un usuario desde la base de datos por ID
  public static async getUser(ID: string): Promise<User | null> {
    const response = await db?.getUser(ID);
    if (response && response.user) {
      return new User(response.user.name, response.user.password, response.user.ID);
    }
    return null;
  }

  public makeUUID(): void {
    this.ID = uuidv4()
  }

  public map(): UserMap {
    return { ID: this.ID, name: this.name, password: this.password } as UserMap
  }
}