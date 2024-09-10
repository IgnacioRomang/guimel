export interface Session {
  userID: string;
  token: string;
}

export interface SessionDatabaseInterface {
  saveSession(name: string, email: string, password: string): Promise<User>;
  getSession(id: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
}
