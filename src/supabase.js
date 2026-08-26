function headers(env, token, extra = {}) {
  return { apikey: env.ONECLICK_SUPABASE_PUBLISHABLE_KEY, authorization: `Bearer ${token}`, "content-type": "application/json", ...extra };
}

function base(env) { return `${env.ONECLICK_SUPABASE_URL.replace(/\/$/, "")}/rest/v1/website_requests`; }

async function checked(response) {
  if (!response.ok) throw new Error(`oneclick_data_${response.status}`);
  return response.status === 204 ? null : response.json();
}

export async function listProjects(env, session, limit = 10) {
  const url = `${base(env)}?select=id,business_name,business_type,location,primary_goal,brand_vibe,generation_mode,status,preset,created_at,updated_at&user_id=eq.${encodeURIComponent(session.user.id)}&order=updated_at.desc&limit=${Math.min(20, Math.max(1, limit))}`;
  return checked(await fetch(url, { headers: headers(env, session.token) }));
}

export async function getProject(env, session, id) {
  const url = `${base(env)}?select=id,business_name,business_type,location,primary_goal,brand_vibe,generation_mode,status,preset,services,target_audience,extra_notes,image_urls,build_insights,lovable_url,created_at,updated_at&id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`;
  const rows = await checked(await fetch(url, { headers: headers(env, session.token) }));
  return rows?.[0] || null;
}

export async function recordHandoff(env, session, id, lovableUrl) {
  const url = `${base(env)}?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}`;
  const rows = await checked(await fetch(url, { method: "PATCH", headers: headers(env, session.token, { prefer: "return=representation" }), body: JSON.stringify({ lovable_url: lovableUrl, status: "handed_off", updated_at: new Date().toISOString() }) }));
  return rows?.[0] || null;
}

