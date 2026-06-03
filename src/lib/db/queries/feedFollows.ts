import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";
export async function createFeedFollow(userID: string, feedID: string) {
    const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({userID, feedID})
    .returning();

    const newFeedFollowID = newFeedFollow.id;

    const [result] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name,
    }).from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedID))
    .innerJoin(users, eq(users.id, feedFollows.userID))
    .where(eq(feedFollows.id, newFeedFollowID));

    return result;
}

export async function getFeedFollowsForUser(userID: string) {
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name,
    }).from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedID))
    .innerJoin(users, eq(users.id, feedFollows.userID))
    .where(eq(feedFollows.userID, userID));

    return result;
}

export async function deleteFeedFollow(userID: string, feedID: string) {
    await db.delete(feedFollows).where(and(
        eq(feedFollows.userID, userID),
        eq(feedFollows.feedID, feedID)
    ));
}