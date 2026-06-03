import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getUser, getUserByID } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";
import type { Feed, User } from "../lib/db/schema.js";
import { createFeedFollow } from "../lib/db/queries/feedFollows.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const [name, url] = args;
    if (!name || !url) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
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

   const feed = await createFeed(name, url, userID);

   printFeed(feed, user);

   const feedFollow = await createFeedFollow(userID, feed.id);

   console.log(feedFollow.userName, feedFollow.feedName);

}


function printFeed(feed: Feed, user: User) {
  console.log(`Name:  ${feed.name}`);
  console.log(`URL:   ${feed.url}`);
  console.log(`User:  ${user.name}`);
  
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
  
  if (args.length > 0) {
    throw new Error(`Usage: ${cmdName}`);
  }

  const allFeeds = await getFeeds();

  for (const feed of allFeeds) {
    const feedCreatorID = feed.userID;
    const feedCreator =  await getUserByID(feedCreatorID);
    printFeed(feed, feedCreator);
  }

  

}