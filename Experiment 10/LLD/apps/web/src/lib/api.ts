import type { DashboardPayload } from "@campusconnect/shared";
import { fallbackArchitecture, fallbackDashboard } from "./fallback";

const baseUrl = process.env.API_GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://localhost:4000";

export async function loadDashboard(userId: string): Promise<DashboardPayload> {
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/${userId}`, {
      next: { revalidate: 5 }
    });

    if (!response.ok) {
      throw new Error("dashboard fetch failed");
    }

    return (await response.json()) as DashboardPayload;
  } catch {
    return fallbackDashboard;
  }
}

export async function loadArchitecture(): Promise<typeof fallbackArchitecture> {
  try {
    const response = await fetch(`${baseUrl}/api/architecture`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error("architecture fetch failed");
    }

    return (await response.json()) as typeof fallbackArchitecture;
  } catch {
    return fallbackArchitecture;
  }
}
