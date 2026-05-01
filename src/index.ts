import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import process from "node:process";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js";

async function main() {
  const registry: CommandsRegistry = {};
  
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister)
  registerCommand(registry, "reset", handlerReset)
  registerCommand(registry, "users", handlerUsers);
  
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("You must provide at least one command line argument.");
    process.exit(1);
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  try {
    await runCommand(registry, commandName, ...commandArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      process.exit(1);
    }

  }
  process.exit(0);
}

main();