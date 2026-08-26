import { textResult } from "./utils.js";

export function bearer(request) {
  const value = request.headers.get("authorization") || "";
  return /^Bearer\s+(.+)$/i.exec(value)?.[1] || null;
}

export function authConfigured(env) { return Boolean(env.ONECLICK_SUPABASE_URL && env.ONECLICK_SUPABASE_PUBLISHABLE_KEY); }

export async function userSession(request, env) {
  const token = bearer(request);
  if (!token || !authConfigured(env)) return null;
  const response = await fetch(`${env.ONECLICK_SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, { headers: { apikey: env.ONECLICK_SUPABASE_PUBLISHABLE_KEY, authorization: `Bearer ${token}` } });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? { token, user } : null;
}

export function authRequired(env) {
  return textResult({ status: "authentication_required", tier: "full", signInUrl: `${env.ONECLICK_SITE_URL || "https://oneclickwebsitedesignfactory.com"}/auth`, stateChanged: false }, "Full Mode requires your existing One Click account. Connect One Click, or continue with anonymous Basic Mode.");
}

export function protectedResource(origin, env) {
  const authBase = env.ONECLICK_SUPABASE_URL ? `${env.ONECLICK_SUPABASE_URL.replace(/\/$/, "")}/auth/v1` : null;
  return { resource: `${origin}/mcp`, authorization_servers: authBase ? [authBase] : [], scopes_supported: ["openid", "email", "profile"], bearer_methods_supported: ["header"], resource_documentation: `${origin}/support` };
}

