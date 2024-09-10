import bcrypt from "bcrypt";

class Hash {
  private static SALT_ROUNDS = 10;
  public static async make(input: string): Promise<string> {
    const hashedInput = await bcrypt.hash(input, this.SALT_ROUNDS);
    return hashedInput;
  }

  public static async check(
    input: string,
    hashedInput: string
  ): Promise<boolean> {
    const match = await bcrypt.compare(input, hashedInput);
    return match;
  }
}

export default Hash;
