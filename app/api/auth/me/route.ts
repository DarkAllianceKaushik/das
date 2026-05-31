import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { isGitHubConfigured, isGitHubRepoConfigured } from "@/lib/github";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({
    authenticated,
    githubConfigured: isGitHubConfigured(),
    githubRepoConfigured: isGitHubRepoConfigured(),
  });
}
