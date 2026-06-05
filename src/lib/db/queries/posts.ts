import { db } from "..";
import { posts, feedFollows, feeds } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(title: string, url: string, feedID: string,
    description?: string, publishedAt?: Date | undefined) {
    const [result] = await db
    .insert(posts)
    .values({title, url, description, publishedAt, feedID})
    .returning();

    return result;

}

export async function getPostsForUser(userID: string, limit: number) {
    const result = await db.select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedID: posts.feedID,
        feedName: feeds.name
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedID, feedFollows.feedID))
    .innerJoin(feeds, eq(posts.feedID, feeds.id))
    .where(eq(feedFollows.userID, userID))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

    return result;
}