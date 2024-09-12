import { User, UserDatabaseInterface, UserToSave } from "../interface/user";

export default abstract class Database implements UserDatabaseInterface {
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
    public abstract getUserByName(
        username: string
    ): Promise<{ user: User | null; message: string }>;
    public abstract deleteUser(id: string): Promise<{ message: string }>;
    // END Metodos de UserDatabaseInterface
}