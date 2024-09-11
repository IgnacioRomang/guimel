export interface User {
  ID: string;
  name: string;
  email: string;
  password: string;
}

export interface UserToSave {
  name: string;
  email: string;
  password: string;
}

export interface UserDatabaseInterface {
  saveUser(
    userToSave: UserToSave
  ): Promise<{ user: User | null; message: string }>;
  getUser(id: string): Promise<{ user: User | null; message: string }>;
  deleteUser(id: string): Promise<{ message: string }>;
}
