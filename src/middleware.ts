import { CommandHandler, UserCommandHandler } from "./commands/commands.js";
import { readConfig } from "./config.js";
import { getUser } from "./lib/db/queries/users.js";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const userName = config.currentUserName;
    if (!userName) {
    throw new Error("no user is currently logged in");
    }
    const user = await getUser(userName);
    if (!user) {
    throw new Error(`user ${userName} not found`);
    }

    await handler(cmdName, user, ...args);
};
}