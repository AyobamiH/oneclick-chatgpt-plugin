import { clean, list } from "./utils.js";

export function normaliseBrief(input = {}) {
  return {
    businessName: clean(input.business_name, 100) || "Your business",
    industry: clean(input.industry, 120),
    primaryGoal: clean(input.primary_goal, 240),
    brandVibe: clean(input.brand_vibe, 160),
    headline: clean(input.headline, 180),
    cta: clean(input.call_to_action, 80),
    layout: clean(input.layout, 60) || "simple-linear",
    services: list(input.services, 12, 120)
  };
}

function basicPrompt(b) {
  const lines = [
    `Build a simple, responsive, single-page website draft for “${b.businessName}”.`,
    "",
    `Business type: ${b.industry}`,
    `Primary goal: ${b.primaryGoal}`,
    b.brandVibe && `Brand feel: ${b.brandVibe}`,
    b.headline && `Headline direction: ${b.headline}`,
    b.cta && `Primary CTA: ${b.cta}`,
    `Layout: ${b.layout}`,
    b.services.length && `Services to represent: ${b.services.join(", ")}`,
    "",
    "Include a clean hero, short business introduction, services section and contact section. Keep the draft lightweight and editable. Do not invent testimonials, certifications, prices, addresses, contact details or other business facts that were not supplied. Use clearly labelled placeholders when a fact is missing."
  ].filter((line) => line !== false && line !== "");
  return lines.join("\n");
}

export function prepareBasic(input) {
  const brief = normaliseBrief(input);
  return {
    schema: "oneclick.lovable-handoff",
    schemaVersion: "1.0.1",
    tier: "basic",
    brief,
    lovable: {
      initial_message: basicPrompt(brief),
      project_knowledge: null,
      recommended_follow_up: "Review the brief, then explicitly authorise any external project creation."
    },
    projectCreated: false,
    deployed: false
  };
}
