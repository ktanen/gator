import { readConfig } from "./config.js";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import process from "node:process";
import { handlerLogin } from "./commands/users.js";
function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("You must provide at least one command line argument.");
    process.exit(1);
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  try {
    runCommand(registry, commandName, ...commandArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      process.exit(1);
    }

  }
  
}

main();