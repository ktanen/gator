import { setUser } from "../config.js";
import { createUser, getUser, deleteUsers, getUsers } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";
import { read } from "node:fs";
import { fetchFeed } from "../lib/rss.js";

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

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const url = "https://www.wagslane.dev/index.xml";
    const feed = await fetchFeed(url);
    console.log(JSON.stringify(feed, null, 2));
}