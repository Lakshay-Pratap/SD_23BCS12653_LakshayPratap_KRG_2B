import type { AnonymousPost, SearchResult, UserProfile } from "../contracts/domain";

export function searchCampus(query: string, profiles: UserProfile[], posts: AnonymousPost[]): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const profileResults = profiles
    .map((profile) => {
      const haystack = [profile.name, profile.handle, profile.department, ...profile.interests, ...profile.skills].join(" ");
      const score = searchScore(normalizedQuery, haystack.toLowerCase());
      return score
        ? {
            id: profile.id,
            type: "profile" as const,
            title: profile.name,
            subtitle: `${profile.department} • ${profile.locationLabel}`,
            score
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const postResults = posts
    .map((post) => {
      const haystack = [post.body, post.campus, ...post.tags].join(" ");
      const score = searchScore(normalizedQuery, haystack.toLowerCase());
      return score
        ? {
            id: post.id,
            type: "post" as const,
            title: post.body.slice(0, 72),
            subtitle: `${post.category} • ${post.campus}`,
            score
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return [...profileResults, ...postResults].sort((left, right) => right.score - left.score).slice(0, 8);
}

function searchScore(query: string, value: string): number {
  if (value.includes(query)) {
    return 1;
  }

  const tokens = query.split(/\s+/).filter(Boolean);
  const hits = tokens.filter((token) => value.includes(token)).length;
  return hits ? Number((hits / tokens.length).toFixed(2)) : 0;
}
