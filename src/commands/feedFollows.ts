import { createFeedFollow, deleteFeedFollow } from "../lib/db/queries/feedFollows.js";
import { getFeedByURL } from "../lib/db/queries/feeds.js";
import { getFeedFollowsForUser } from "../lib/db/queries/feedFollows.js";
import { User } from "../lib/db/schema.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <url>`);
    }

    const url = args[0];



    const userID = user.id;

    const feed = await getFeedByURL(url);

    if (!feed) {
        throw new Error(`No feed found at ${url}`);
    }

    const feedID = feed.id;

    const feedFollow = await createFeedFollow(userID, feedID);

    console.log(`Current user ${user.name} followed the ${feedFollow.feedName} feed.`);

}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {

  if (args.length > 0) {
    throw new Error(`Usage: ${cmdName}`);
  }


    const userID = user.id;

    const userFeedFollows = await getFeedFollowsForUser(userID);

    for (const feedFollow of userFeedFollows) {
        console.log(feedFollow.feedName);
    }

}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <url>`);
    }

    const url = args[0];

    const feed = await getFeedByURL(url);

    if (!feed) {
        throw new Error("No feed found at this url");
    }

    await deleteFeedFollow(user.id, feed.id);
}