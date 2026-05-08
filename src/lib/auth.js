import { auth } from "@clerk/nextjs/server";

export function requireUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}