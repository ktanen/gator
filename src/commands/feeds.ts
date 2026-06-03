import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getUserByID } from "../lib/db/queries/users.js";
import type { Feed, User } from "../lib/db/schema.js";
import { createFeedFollow } from "../lib/db/queries/feedFollows.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const [name, url] = args;
    if (!name || !url) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
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