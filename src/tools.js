import { prepareBasic, prepareFull, fromSavedProject } from "./draft.js";
import { authRequired, userSession } from "./auth.js";
import { getProject, listProjects, recordHandoff } from "./supabase.js";
import { textResult } from "./utils.js";

const string = (description, maxLength = 500) => ({ type: "string", maxLength, description });
const briefProperties = {
  business_name: string("Business or project name", 100), industry: string("Business type or industry", 120), location: string("Primary service location", 160),
  primary_goal: string("Primary website outcome", 240), brand_vibe: string("Desired brand personality", 160), headline: string("Optional headline direction", 180),
  call_to_action: string("Optional primary CTA", 80), layout: string("Optional One Click layout ID", 60), style_preset: string("Optional One Click style preset ID", 60),
  target_audience: string("Optional target audience", 300), additional_notes: string("Optional constraints and context", 1000),
  services: { type: "array", maxItems: 20, items: string("Service", 120) }, colours: { type: "array", maxItems: 8, items: string("Colour name or hex", 32) },
  reference_image_urls: { type: "array", maxItems: 10, items: { type: "string", maxLength: 500, pattern: "^https://" }, description: "HTTPS reference images selected by the user" }
};
const briefSchema = { type: "object", additionalProperties: false, required: ["business_name", "industry", "location", "primary_goal", "brand_vibe"], properties: briefProperties };
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };
const externalRead = { ...readOnly, openWorldHint: true };

export const TOOLS = [
  { name: "oneclick_prepare_basic_draft", title: "Prepare Basic website draft", description: "Use for an anonymous, lightweight website draft. It structures a brief for the installed Lovable plugin without saving data or claiming a project was built.", inputSchema: briefSchema, outputSchema: { type: "object", additionalProperties: true }, annotations: readOnly },
  { name: "oneclick_prepare_full_handoff", title: "Prepare Full Mode handoff", description: "Use for an authenticated One Click customer's production-oriented Lovable handoff, knowledge base, SEO, accessibility, security and sprint plan. Requires the existing One Click identity through the MCP Authorization header.", inputSchema: briefSchema, outputSchema: { type: "object", additionalProperties: true }, annotations: readOnly },
  { name: "oneclick_list_projects", title: "List saved One Click projects", description: "List only the connected user's saved One Click projects. Requires authentication and respects the website's row-level security.", inputSchema: { type: "object", additionalProperties: false, properties: { limit: { type: "integer", minimum: 1, maximum: 20, default: 10 } } }, outputSchema: { type: "object", additionalProperties: true }, annotations: externalRead },
  { name: "oneclick_get_project", title: "Get saved One Click project", description: "Retrieve one saved project belonging to the connected user and return a Full Mode Lovable handoff. Requires authentication.", inputSchema: { type: "object", additionalProperties: false, required: ["project_id"], properties: { project_id: { type: "string", minLength: 1, maxLength: 80 } } }, outputSchema: { type: "object", additionalProperties: true }, annotations: externalRead },
  { name: "oneclick_get_knowledge_base", title: "Get project knowledge base", description: "Return the saved build insights and regenerated production knowledge for one connected user's project. Requires authentication.", inputSchema: { type: "object", additionalProperties: false, required: ["project_id"], properties: { project_id: { type: "string", minLength: 1, maxLength: 80 } } }, outputSchema: { type: "object", additionalProperties: true }, annotations: externalRead },
  { name: "oneclick_record_lovable_handoff", title: "Record Lovable handoff", description: "After the user authorises creation and Lovable returns a project URL, record that URL on the user's existing One Click project. This changes the saved project and requires authentication.", inputSchema: { type: "object", additionalProperties: false, required: ["project_id", "lovable_project_url"], properties: { project_id: { type: "string", minLength: 1, maxLength: 80 }, lovable_project_url: { type: "string", maxLength: 500, pattern: "^https://" } } }, outputSchema: { type: "object", additionalProperties: true }, annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true } }
];

async function requireSession(request, env) { return userSession(request, env); }
export async function callTool(name, args, request, env) {
  if (name === "oneclick_prepare_basic_draft") return textResult(prepareBasic(args), "One Click prepared an anonymous Basic Mode handoff. Review it before creating the Lovable project.");
  if (name === "oneclick_prepare_full_handoff") {
    const session = await requireSession(request, env); if (!session) return authRequired(env);
    return textResult(prepareFull(args, { kind: "authenticated_chat_brief", user_id: session.user.id }), "One Click prepared a connected Full Mode handoff with project knowledge. Review it before creating the Lovable project.");
  }
  if (name === "oneclick_list_projects") {
    const session = await requireSession(request, env); if (!session) return authRequired(env);
    const projects = await listProjects(env, session, args.limit || 10); return textResult({ status: "ok", projects, stateChanged: false }, `Found ${projects.length} saved One Click project(s).`);
  }
  if (name === "oneclick_get_project" || name === "oneclick_get_knowledge_base") {
    const session = await requireSession(request, env); if (!session) return authRequired(env);
    const project = await getProject(env, session, args.project_id); if (!project) return textResult({ status: "not_found", stateChanged: false }, "That saved One Click project was not found for the connected user.");
    const handoff = fromSavedProject(project);
    if (name === "oneclick_get_knowledge_base") return textResult({ status: "ok", projectId: project.id, savedBuildInsights: project.build_insights || null, projectKnowledge: handoff.lovable.project_knowledge, stateChanged: false }, "Returned the project's saved insights and regenerated One Click knowledge base.");
    return textResult(handoff, "Returned the saved One Click project as a Full Mode Lovable handoff.");
  }
  if (name === "oneclick_record_lovable_handoff") {
    const session = await requireSession(request, env); if (!session) return authRequired(env);
    const project = await recordHandoff(env, session, args.project_id, args.lovable_project_url); return textResult({ status: project ? "updated" : "not_found", project: project ? { id: project.id, status: project.status, lovableUrl: project.lovable_url } : null, stateChanged: Boolean(project) }, project ? "Recorded the approved Lovable handoff on the One Click project." : "No matching One Click project was updated.");
  }
  throw new Error("tool_not_found");
}

