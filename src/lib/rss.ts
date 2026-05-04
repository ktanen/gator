import { desc } from "drizzle-orm";
import { XMLParser } from "fast-xml-parser";
import { error } from "node:console";
import { channel } from "node:diagnostics_channel";
import { stringify } from "node:querystring";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    method: "GET",
    headers: {
        "User-Agent": "gator"
    }
  });

  const responseText = await response.text();

  const parser = new XMLParser({processEntities: false});
  const obj = parser.parse(responseText);
  
  const rssChannel = obj?.rss?.channel;

  if (!rssChannel) {
    throw new Error("Missing 'channel' element");
  }

  if (!rssChannel.title) {
    throw new Error("Missing title");
  }

  if (typeof rssChannel.title !== "string") {
    throw new Error("title is not a string");
  }

  if (!rssChannel.link) {
    throw new Error ("Missing link");
  }

  if (typeof rssChannel.link !== "string") {
    throw new Error ("link is not a string");
  }

  if (!rssChannel.description) {
    throw new Error("Missing description");
  }

  if (typeof rssChannel.description !== "string") {
    throw new Error("description is not a string");
  }

  const title = rssChannel.title;
  const link = rssChannel.link;
  const description = rssChannel.description;

  let rawItems: RSSItem[];
  if (!rssChannel.item) {
    rawItems = []
  } else if (!Array.isArray(rssChannel.item)) {
    rawItems = [rssChannel.item];
  } else {
    rawItems = rssChannel.item;
  }
  
  const items: RSSItem[] = [];
  for (const rawItem of rawItems) {
    if (typeof rawItem.title !== "string" || typeof rawItem.link !== "string" ||
       typeof rawItem.description !== "string" || typeof rawItem.pubDate !== "string") {
        continue;
    }
    items.push({
      title: rawItem.title,
      link: rawItem.link,
      description: rawItem.description,
      pubDate: rawItem.pubDate,
    });
  }

  const feed: RSSFeed = {
    channel: {
      title: title,
      link: link,
      description: description,
      item: items
    }
  };

  return feed;
}