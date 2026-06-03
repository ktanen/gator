import type { User } from "../lib/db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const handler = registry[cmdName];

    if (handler === undefined) {
        throw new Error ("Command not recognized");
    }

    await handler(cmdName, ...args);
}