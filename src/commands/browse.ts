import { getPostsForUser } from "../lib/db/queries/posts.js";
import { User } from "../lib/db/schema.js";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    if (args.length > 1) {
        throw new Error(`Usage: ${cmdName} [limit]`);
    }

    const limit = (args.length === 1) ? Number(args[0]): 2;
    if (isNaN(limit) || limit < 1) {
        throw new Error(`Usage: ${cmdName} [limit]`);
    }
    
    const userID = user.id;

    const posts = await getPostsForUser(userID, limit);

    for (const post of posts) {
        console.log(post);
    }

}
