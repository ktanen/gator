import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import process from "node:process";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers, handlerAgg } from "./commands/users.js";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/feedFollows.js";
import { middlewareLoggedIn } from "./middleware.js";
async function main() {
  const registry: CommandsRegistry = {};
  
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister)
  registerCommand(registry, "reset", handlerReset)
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));

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