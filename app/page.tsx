import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { createEpisode } from "./actions";
import { isYouTubeUrl } from "@/lib/youtube";

export const instant = false;

export default async function Home() {
  const allEpisodes = await db
    .select()
    .from(episodes)
    .orderBy(sql`${episodes.published_on} desc nulls last`, desc(episodes.id));

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="brand-mark" aria-hidden="true">
          E
        </div>
        <p className="eyebrow">YOUR WATCHLIST, IN ONE PLACE</p>
        <h1>Episode tracker</h1>
        <p className="intro">
          Keep track of the conversations you want to watch, all in one simple
          list.
        </p>
      </header>

      <section className="content-grid" aria-label="Episode tracker">
        <section className="panel form-panel" aria-labelledby="add-heading">
          <div className="section-heading">
            <span className="step-number" aria-hidden="true">
              01
            </span>
            <div>
              <p className="eyebrow">ADD TO YOUR LIST</p>
              <h2 id="add-heading">New episode</h2>
            </div>
          </div>

          <form action={createEpisode} className="episode-form">
            <label>
              <span>Episode title</span>
              <input
                autoComplete="off"
                maxLength={300}
                name="title"
                placeholder="e.g. How to build better habits"
                required
              />
            </label>

            <label>
              <span>Guest <span className="optional">(optional)</span></span>
              <input
                autoComplete="name"
                maxLength={200}
                name="guest"
                placeholder="Who is being interviewed?"
              />
            </label>

            <label>
              <span>
                YouTube URL <span className="optional">(optional)</span>
              </span>
              <input
                autoComplete="url"
                name="youtube_url"
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
              />
            </label>

            <label>
              <span>
                Publish date <span className="optional">(optional)</span>
              </span>
              <input name="published_on" type="date" />
            </label>

            <button className="submit-button" type="submit">
              <span aria-hidden="true">+</span> Add episode
            </button>
          </form>
          <p className="form-note">
            Your episode is saved to the database and added to this list.
          </p>
        </section>

        <EpisodeList allEpisodes={allEpisodes} />
      </section>

      <footer className="page-footer">
        A small, personal library for the episodes worth coming back to.
      </footer>
    </main>
  );
}

function EpisodeList({
  allEpisodes,
}: {
  allEpisodes: (typeof episodes.$inferSelect)[];
}) {
  return (
    <section className="panel list-panel" aria-labelledby="list-heading">
      <div className="list-heading">
        <div className="section-heading">
          <span className="step-number" aria-hidden="true">
            02
          </span>
          <div>
            <p className="eyebrow">SAVED IN YOUR DATABASE</p>
            <h2 id="list-heading">Your episodes</h2>
          </div>
        </div>
        <span className="episode-count">
          {allEpisodes.length}{" "}
          {allEpisodes.length === 1 ? "episode" : "episodes"}
        </span>
      </div>

      {allEpisodes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ↗
          </span>
          <h3>Your list is ready</h3>
          <p>Add an episode using the form and it will show up here.</p>
        </div>
      ) : (
        <ol className="episode-list">
          {allEpisodes.map((episode) => (
            <li className="episode-card" key={episode.id}>
              <div className="episode-card-top">
                <span className="episode-number">
                  EP. {String(episode.id).padStart(2, "0")}
                </span>
                {episode.published_on && (
                  <time dateTime={episode.published_on}>
                    {new Date(
                      `${episode.published_on}T00:00:00Z`,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                )}
              </div>
              <h3>{episode.title}</h3>
              <p className="episode-guest">
                {episode.guest || "Guest not listed"}
              </p>
              {episode.youtube_url && (
                <p className="episode-link">
                  {isYouTubeUrl(episode.youtube_url) ? (
                    <a
                      href={episode.youtube_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Watch on YouTube <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span>{episode.youtube_url}</span>
                  )}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
