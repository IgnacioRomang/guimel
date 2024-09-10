export interface User {
  ID: string;
  name: string;
  email: string;
  password: string;
  // Agrega otros campos de usuario según sea necesario
}

export interface UserDatabaseInterface {
  saveUser(name: string, email: string, password: string): Promise<User>;
  getUser(id: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
}
