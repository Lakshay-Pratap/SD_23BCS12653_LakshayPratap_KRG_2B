import type { DashboardPayload } from "@campusconnect/shared";
import { RealtimeIndicator } from "../src/components/realtime-indicator";
import { loadArchitecture, loadDashboard } from "../src/lib/api";

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatRelative(timestamp: string): string {
  const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(timestamp).getTime()) / 60000));
  return `${diffMinutes}m ago`;
}

function MatchCard({ match, dashboard }: { match: DashboardPayload["matches"][number]; dashboard: DashboardPayload }) {
  const profile = dashboard.recommendations.people.find((entry) => entry.userId === match.userId);

  return (
    <article className="card match-card">
      <div className="card-kicker">Match score</div>
      <h3>{match.userId}</h3>
      <div className="score-row">
        <strong>{pct(match.score)}</strong>
        <span>{match.compatibilityBand}</span>
      </div>
      <p>{match.reason}</p>
      <ul className="tag-row">
        {match.sharedInterests.map((interest) => (
          <li key={interest}>{interest}</li>
        ))}
        <li>{match.distanceKm} km</li>
        <li>{match.geospatialBucket}</li>
        {profile ? <li>Recommended</li> : null}
      </ul>
    </article>
  );
}

export default async function Page() {
  const [dashboard, architecture] = await Promise.all([loadDashboard("user-1"), loadArchitecture()]);
  const primaryConversation = dashboard.conversations[0];

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">CampusConnect+</p>
          <h1>Realtime campus networking with scalable systems under the hood.</h1>
          <p className="hero-text">
            A production-style platform for campus discovery, secure identity, anonymous community posts, live chat,
            and hybrid recommendations powered by a resilient gateway and service-oriented backend.
          </p>
          <div className="hero-badges">
            <span>JWT + OAuth</span>
            <span>GeoHash matching</span>
            <span>Socket.IO chat</span>
            <span>Kafka workflows</span>
            <span>Redis cache</span>
          </div>
        </div>
        <div className="hero-aside card glass">
          <div className="mini-stat">
            <span>Active identity</span>
            <strong>{dashboard.profile.name}</strong>
          </div>
          <div className="mini-stat">
            <span>Route corridor</span>
            <strong>{dashboard.profile.routeTag}</strong>
          </div>
          <div className="mini-stat">
            <span>Experiment bucket</span>
            <strong>{dashboard.recommendations.explanation.experimentationBucket}</strong>
          </div>
          <RealtimeIndicator conversationId={primaryConversation?.id ?? "conv-1"} />
        </div>
      </section>

      <section className="metrics-grid">
        {dashboard.metrics.map((metric) => (
          <article key={metric.label} className="card metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.delta}</p>
          </article>
        ))}
        <article className="card metric-card accent">
          <span>Daily active users</span>
          <strong>{dashboard.analytics.dailyActiveUsers}</strong>
          <p>{dashboard.analytics.experimentLift} lift from experiment</p>
        </article>
      </section>

      <section className="content-grid">
        <div className="stack">
          <article className="card section-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Matching engine</p>
                <h2>Route-aware people discovery</h2>
              </div>
              <span className="pill">{dashboard.profile.locationLabel}</span>
            </div>
            <div className="card-grid">
              {dashboard.matches.map((match) => (
                <MatchCard key={match.userId} match={match} dashboard={dashboard} />
              ))}
            </div>
          </article>

          <article className="card section-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Anonymous feed</p>
                <h2>Moderated community signal</h2>
              </div>
              <span className="pill warning">{dashboard.moderationQueue.length} in review</span>
            </div>
            <div className="feed-list">
              {dashboard.posts.map((post) => (
                <article key={post.id} className="feed-item">
                  <div className="feed-meta">
                    <span>{post.category}</span>
                    <span>{post.campus}</span>
                    <span>{formatRelative(post.createdAt)}</span>
                  </div>
                  <h3>{post.body}</h3>
                  <p>
                    Moderation score {post.moderationScore} • Reports {post.reports} • Anonymous hash {post.authorHash}
                  </p>
                  <div className="tag-row">
                    {post.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                    {typeof post.recommendationScore === "number" ? <span>rec {post.recommendationScore}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="stack">
          <article className="card section-card">
            <p className="eyebrow">Realtime chat</p>
            <h2>Offline-safe conversations</h2>
            <div className="chat-list">
              {dashboard.conversations.map((conversation) => (
                <div key={conversation.id} className="chat-item">
                  <div>
                    <strong>{conversation.title}</strong>
                    <p>{conversation.preview}</p>
                  </div>
                  <div className="chat-meta">
                    <span>{conversation.type}</span>
                    <span>{conversation.unread} unread</span>
                    <span>{conversation.offlineBacklog} queued</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card section-card">
            <p className="eyebrow">Recommendations</p>
            <h2>Hybrid ranking signals</h2>
            <div className="signal-block">
              <strong>Collaborative</strong>
              <p>{dashboard.recommendations.explanation.collaborativeSignals.join(" • ")}</p>
            </div>
            <div className="signal-block">
              <strong>Content based</strong>
              <p>{dashboard.recommendations.explanation.contentSignals.join(" • ")}</p>
            </div>
            <div className="signal-block">
              <strong>Flags and experiments</strong>
              <p>{dashboard.featureFlags.length} flags live • {dashboard.experiments[0]?.activeVariant ?? "control"} active</p>
            </div>
          </article>

          <article className="card section-card">
            <p className="eyebrow">Admin moderation</p>
            <h2>Trust and safety queue</h2>
            {dashboard.moderationQueue.map((item) => (
              <div key={item.postId} className="queue-item">
                <strong>{item.postId}</strong>
                <p>{item.reasons.join(", ")}</p>
                <span>
                  {item.status} • reports {item.reports} • score {item.score}
                </span>
              </div>
            ))}
          </article>
        </aside>
      </section>

      <section className="footer-grid">
        <article className="card section-card">
          <p className="eyebrow">Architecture</p>
          <h2>Built for scale and graceful degradation</h2>
          <p>{architecture.topology}</p>
          <div className="detail-list">
            <div>
              <strong>Resilience</strong>
              <p>{architecture.resilience.join(" • ")}</p>
            </div>
            <div>
              <strong>Data</strong>
              <p>{architecture.dataStores.join(" • ")}</p>
            </div>
            <div>
              <strong>Async backbone</strong>
              <p>{architecture.asyncBackbone.join(" • ")}</p>
            </div>
          </div>
          <div className="capability-list">
            {dashboard.capabilities.map((capability) => (
              <div key={capability.name} className="capability-item">
                <strong>{capability.name}</strong>
                <p>{capability.notes}</p>
                <span>{capability.stack.join(" / ")}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card section-card">
          <p className="eyebrow">Search and health</p>
          <h2>Operational visibility</h2>
          <div className="search-results">
            {dashboard.searchHighlights.map((result) => (
              <div key={`${result.type}-${result.id}`} className="search-item">
                <strong>{result.title}</strong>
                <p>{result.subtitle}</p>
                <span>{result.type} • score {result.score}</span>
              </div>
            ))}
          </div>
          <div className="health-grid">
            {dashboard.health.map((service) => (
              <div key={service.service} className={`health-item ${service.ok ? "healthy" : "degraded"}`}>
                <strong>{service.service}</strong>
                <p>{service.latencyMs} ms</p>
                <span>{service.degraded ? "degraded fallback" : "healthy"}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
