import type { ModerationOutcome } from "../contracts/domain";

const TOXIC_PATTERNS = [/kill yourself/i, /hate you/i, /doxx/i, /slur/i, /violence/i];
const SPAM_PATTERNS = [/free crypto/i, /telegram group/i, /buy followers/i];
const SAFETY_PATTERNS = [/harassment/i, /unsafe/i, /stalking/i, /threat/i];

export function moderateContent(input: string): ModerationOutcome {
  const reasons: string[] = [];
  let score = 0.08;

  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(input)) {
      reasons.push("toxicity");
      score += 0.42;
    }
  }

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(input)) {
      reasons.push("spam");
      score += 0.24;
    }
  }

  for (const pattern of SAFETY_PATTERNS) {
    if (pattern.test(input)) {
      reasons.push("safety-risk");
      score += 0.18;
    }
  }

  if (input.length > 500) {
    reasons.push("oversized");
    score += 0.08;
  }

  const normalizedScore = Number(Math.min(1, score).toFixed(2));
  return {
    flagged: normalizedScore >= 0.65,
    reasons: Array.from(new Set(reasons)),
    score: normalizedScore,
    requiresHumanReview: normalizedScore >= 0.5
  };
}

export function moderationProvider(): string {
  return process.env.CONTENT_MODERATION_PROVIDER ?? "heuristic";
}
