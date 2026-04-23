import { createHmac } from "node:crypto";

function encode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

export function signJwt(payload: Record<string, string | number>, secret: string): string {
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = encode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}
