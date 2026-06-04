import { setUser } from "../config.js";
import { createUser, getUser, deleteUsers, getUsers } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";
import { read } from "node:fs";
import { fetchFeed } from "../lib/rss.js";
import { toUSVString } from "node:util";
import { scrapeFeeds } from "src/lib/db/queries/feeds.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("The login command expects a single username argument.");
    }
    const username = args[0];

    if (await getUser(username) === undefined) {
        throw new Error("This username does not exist in the database. Please register.");
    }
    
    setUser(username);
    console.log(`User ${username} logged in`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("The register command expects a single username argument.");
    }

    const username = args[0];

    if (await getUser(username) !== undefined) {
        throw new Error("This username is already registered.");
    }
    
    const user = await createUser(username);
    setUser(username);

    console.log(user);
    
    console.log(`User ${username} created successfully`)
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteUsers();
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const allUsers = await getUsers();
    const config = readConfig();
    
    const currentUserName = config.currentUserName;

    for (const user of allUsers) {
        if (user.name === currentUserName) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}

function handleError(err: unknown) {
  console.error(err);
}

export async function handlerAgg(cmdName: string, ...args: string[]) {

    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
    }

    const timeBetweenRequests = args[0];
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = timeBetweenRequests.match(regex);

    if (!match) {
       throw new Error("Invalid duration. Use formats like 500ms, 1s, 1m, or 1h");
    }

    const amount = Number(match[1]);

    if (Number.isNaN(amount)) {
        throw new Error("Non-numeric duration amount.");
    }

    const unit = match[2];
    let multiplier: number;
    switch (unit) {
        case "ms":
            multiplier = 1;
            break;
        case "s":
            multiplier = 1000;
            break;
        case "m":
            multiplier = 60000;
            break;
        case "h":
            multiplier = 3600000;
            break;
        default:
            throw new Error("Invalid unit. Use ms, s, m, or h");
    }

    console.log(`Collecting feeds every ${timeBetweenRequests}`);

    const milliseconds = amount * multiplier;

    scrapeFeeds().catch(handleError);
    console.log("");

    const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
    }, milliseconds);
    console.log("");
    await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
    });
    });


}