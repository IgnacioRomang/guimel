export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  // Agrega otros campos de usuario según sea necesario
}

export interface UserDatabaseInterface {
  saveUser(user: User): Promise<void>;
  getUser(id: string): Promise<User | null>;
}
