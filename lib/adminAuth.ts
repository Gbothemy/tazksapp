import { cookies } from "next/headers";

const ADMIN_TOKEN = "qeixova-admin-2025";

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === ADMIN_TOKEN;
}

export function checkAdminHeader(req: Request): boolean {
  const key = req.headers.get("x-admin-key");
  return key === ADMIN_TOKEN;
}

export async function checkAdminAuth(req: Request): Promise<boolean> {
  if (checkAdminHeader(req)) return true;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === ADMIN_TOKEN;
}
