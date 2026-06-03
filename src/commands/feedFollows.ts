import { createFeedFollow } from "../lib/db/queries/feedFollows.js";
import { getFeedByURL } from "../lib/db/queries/feeds.js";
import { getUser } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";
import { getFeedFollowsForUser } from "../lib/db/queries/feedFollows.js";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <url>`);
    }

    const url = args[0];

    const config = readConfig();
    const userName = config.currentUserName;
    if (!userName) {
    throw new Error("no user is currently logged in");
    }
    const user = await getUser(userName);
    if (!user) {
    throw new Error(`user ${userName} not found`);
    }

    const userID = user.id;

    const feed = await getFeedByURL(url);

    if (!feed) {
        throw new Error(`No feed found at ${url}`);
    }

    const feedID = feed.id;

    const feedFollow = await createFeedFollow(userID, feedID);

    console.log(`Current user ${userName} followed the ${feedFollow.feedName} feed.`);

}

export async function handlerFollowing(cmdName: string, ...args: string[]) {

  if (args.length > 0) {
    throw new Error(`Usage: ${cmdName}`);
  }

    const config = readConfig();
    const userName = config.currentUserName;
    if (!userName) {
    throw new Error("no user is currently logged in");
    }
    const user = await getUser(userName);
    if (!user) {
    throw new Error(`user ${userName} not found`);
    }

    const userID = user.id;

    const userFeedFollows = await getFeedFollowsForUser(userID);

    for (const feedFollow of userFeedFollows) {
        console.log(feedFollow.feedName);
    }

}