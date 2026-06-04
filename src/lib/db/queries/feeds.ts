
import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";
import {fetchFeed} from "../../../lib/rss.js"

export async function createFeed(name: string, url: string, userID: string) {
    const [result] = await db
    .insert(feeds)
    .values({name, url, userID})
    .returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByURL(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function markFeedFetched(feedID: string) {
    const currentTime = new Date();
    await db.update(feeds).set({
        lastFetchedAt: currentTime,
        updatedAt: currentTime,
    }
    ).where(eq(feeds.id, feedID));
}

export async function getNextFeedToFetch() {
    const [result] = await db.select().from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);

    return result;
}

export async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    
    if (!nextFeed) {
        return;
    }

    const url = nextFeed.url;
    const feedID = nextFeed.id;

    const feed = await fetchFeed(url);

    await markFeedFetched(feedID);

    for (let item of feed.channel.item) {
        console.log(item.title);
    }

}