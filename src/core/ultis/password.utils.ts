import { genSalt, compare, hash } from "bcrypt";

export class PasswordUtil {
    public static async encryptPassword(
        rounds: number,
        password: string,
    ): Promise<string> {
        const salted: string = await genSalt(rounds);

        const hashed: string = await hash(password, salted);

        return hashed;
    }

    public static async validatePassword(params: {
        requestPassword: string;
        storedPassword: string;
    }): Promise<boolean> {
        const { requestPassword, storedPassword } = params;
        const password = await compare(requestPassword, storedPassword);

        if (!password) {
            return false;
        }

        return true;
    }
}