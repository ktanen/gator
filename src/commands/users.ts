import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("The login command expects a single username argument.");
    }
    const username = args[0];
    setUser(username);
    console.log(`User ${username} set`);
}