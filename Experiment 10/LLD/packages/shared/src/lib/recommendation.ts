import type { AnonymousPost, MatchCandidate, UserProfile } from "../contracts/domain";
import { haversineDistanceKm } from "./geospatial";

export function scoreMatch(primary: UserProfile, candidate: UserProfile): MatchCandidate {
  const sharedInterests = candidate.interests.filter((interest) => primary.interests.includes(interest));
  const distanceKm = haversineDistanceKm(
    primary.latitude,
    primary.longitude,
    candidate.latitude,
    candidate.longitude
  );
  const routeAffinity = primary.routeTag === candidate.routeTag ? 1 : 0.35;
  const interestScore = sharedInterests.length * 0.16;
  const skillAffinity = candidate.skills.filter((skill) => primary.skills.includes(skill)).length * 0.12;
  const collaborativeBoost = candidate.department === primary.department ? 0.1 : 0.04;
  const proximityScore = Math.max(0, 1 - distanceKm / 12);
  const reputationScore = candidate.reputation / 100;
  const score = Number(
    Math.min(
      1,
      interestScore + skillAffinity + collaborativeBoost + proximityScore * 0.3 + routeAffinity * 0.2 + reputationScore * 0.1
    )
      .toFixed(2)
  );

  return {
    userId: candidate.id,
    score,
    sharedInterests,
    routeAffinity,
    distanceKm: Number(distanceKm.toFixed(1)),
    reason: sharedInterests.length
      ? `Shared interests in ${sharedInterests.slice(0, 2).join(", ")} and overlapping movement patterns`
      : "Nearby on a similar route with complementary skills",
    compatibilityBand: score >= 0.8 ? "high" : score >= 0.6 ? "medium" : "emerging",
    geospatialBucket: candidate.geohash
  };
}

export function rankPosts(profile: UserProfile, posts: AnonymousPost[]): AnonymousPost[] {
  return [...posts]
    .map((post) => ({
      ...post,
      recommendationScore: Number(hybridPostScore(profile, post).toFixed(2))
    }))
    .sort((left, right) => (right.recommendationScore ?? 0) - (left.recommendationScore ?? 0))
    .slice(0, 5);
}

function hybridPostScore(profile: UserProfile, post: AnonymousPost): number {
  const contentBoost = post.tags.filter((tag) => profile.interests.includes(tag)).length * 0.4;
  const freshnessBoost = Math.max(0, 1 - ageInHours(post.createdAt) / 24) * 0.35;
  const safetyPenalty = post.moderationScore > 0.8 ? 0.7 : 0;
  const engagementBoost = Math.min(0.25, post.reports === 0 ? 0.25 : 0.05);
  return contentBoost + freshnessBoost + engagementBoost - safetyPenalty;
}

function ageInHours(createdAt: string): number {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}
