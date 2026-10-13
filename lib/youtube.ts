export function isYouTubeUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
        url.hostname,
      )
    );
  } catch {
    return false;
  }
}
