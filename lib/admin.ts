const adminIds = (process.env.NEXT_PUBLIC_ADMIN_USER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return adminIds.includes(userId);
}
