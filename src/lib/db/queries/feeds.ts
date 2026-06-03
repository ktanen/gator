
import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";

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