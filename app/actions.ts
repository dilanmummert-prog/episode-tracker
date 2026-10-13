"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { isYouTubeUrl } from "@/lib/youtube";

function getOptionalText(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") {
    throw new Error(`The ${name} field must be text.`);
  }
  return value.trim() || null;
}

export async function createEpisode(formData: FormData) {
  const title = formData.get("title");
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Please enter an episode title.");
  }
  if (title.trim().length > 300) {
    throw new Error("Episode titles must be 300 characters or fewer.");
  }

  const guest = getOptionalText(formData, "guest");
  if (guest && guest.length > 200) {
    throw new Error("Guest names must be 200 characters or fewer.");
  }

  const youtubeUrl = getOptionalText(formData, "youtube_url");
  if (youtubeUrl && !isYouTubeUrl(youtubeUrl)) {
    throw new Error("Please enter a valid YouTube URL.");
  }

  const publishedOn = getOptionalText(formData, "published_on");
  if (publishedOn) {
    const parsedDate = new Date(`${publishedOn}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(publishedOn) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== publishedOn
    ) {
      throw new Error("Please enter a valid publish date.");
    }
  }

  await db.insert(episodes).values({
    title: title.trim(),
    guest,
    youtube_url: youtubeUrl,
    published_on: publishedOn,
  });

  redirect("/");
}
