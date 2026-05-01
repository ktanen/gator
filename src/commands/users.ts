import { setUser } from "../config.js";
import { createUser, getUser, deleteUsers } from "../lib/db/queries/users.js";

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