import { prisma } from "@/lib/prisma";

const defaultDemoUserId = "00000000-0000-4000-8000-000000000001";

/** Temporary server-only identity resolution until authentication is introduced. */
export async function getDemoUserId() {
  const configuredId = process.env.DAYFLOW_DEMO_USER_ID ?? defaultDemoUserId;
  const configuredUser = await prisma.user.findUnique({ where: { id: configuredId }, select: { id: true } });
  if (configuredUser) return configuredUser.id;

  // The seed identifies the same user by a stable local-development email. Do
  // not create a user during a request: that could hide a configuration error.
  const seededUser = await prisma.user.findUnique({ where: { email: "demo@dayflow.local" }, select: { id: true } });
  if (seededUser) return seededUser.id;

  throw new Error("Demo user is not initialized. Run the documented development seed command.");
}
