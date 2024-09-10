class UserController {
  private static instance: UserController;
  private users: Map<string, UserToken> = new Map();

  private constructor() {}

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public addUser(user: User, token: string): void {
    this.users.set(user.id, { user, token });
  }

  public getUserToken(userId: string): UserToken | undefined {
    return this.users.get(userId);
  }

  public removeUser(userId: string): void {
    this.users.delete(userId);
  }
}

export default UserController;
