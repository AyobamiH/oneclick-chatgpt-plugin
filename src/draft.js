import { clean, list } from "./utils.js";

const LAYOUTS = new Set(["simple-linear", "corporate-grid", "creative-story", "premium-luxury", "local-service", "modern-editorial", "bento-grid", "split-screen", "immersive-fullscreen", "card-modular", "timeline-journey"]);
const PRESETS = new Set(["minimalist", "flat-design", "material-design", "brutalism", "skeuomorphism", "neumorphism", "retro-vintage", "gothic-dark", "maximalism"]);

export function normaliseBrief(input = {}) {
  const brief = {
    businessName: clean(input.business_name, 100), industry: clean(input.industry, 120), location: clean(input.location, 160),
    primaryGoal: clean(input.primary_goal, 240), brandVibe: clean(input.brand_vibe, 160), headline: clean(input.headline, 180),
    cta: clean(input.call_to_action, 80), layout: clean(input.layout, 60), stylePreset: clean(input.style_preset, 60),
    targetAudience: clean(input.target_audience, 300), notes: clean(input.additional_notes, 1000), services: list(input.services, 20, 120),
    colours: list(input.colours, 8, 32), referenceImages: list(input.reference_image_urls, 10, 500).filter((url) => /^https:\/\//i.test(url)),
  };
  const required = [["business_name", brief.businessName], ["industry", brief.industry], ["location", brief.location], ["primary_goal", brief.primaryGoal], ["brand_vibe", brief.brandVibe]];
  const missing = required.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length) throw new Error(`missing_required_fields:${missing.join(",")}`);
  if (brief.layout && !LAYOUTS.has(brief.layout)) brief.layout = "simple-linear";
  if (brief.stylePreset && !PRESETS.has(brief.stylePreset)) brief.stylePreset = "minimalist";
  return brief;
}

function basicPrompt(b) {
  const extras = [b.headline && `Headline direction: ${b.headline}`, b.cta && `Primary CTA: ${b.cta}`, b.layout && `Layout: ${b.layout}`, b.notes && `Notes: ${b.notes}`].filter(Boolean);
  return `Build a simple, responsive, single-page website draft for “${b.businessName}”.\n\nBusiness type: ${b.industry}\nLocation: ${b.location}\nPrimary goal: ${b.primaryGoal}\nBrand feel: ${b.brandVibe}\n${extras.join("\n")}\n\nInclude a clean hero, short business introduction, simple services list and contact section. Use a light, neutral, minimal layout with no unnecessary animation. Keep this anonymous Basic Mode draft lightweight and generic. Do not invent customer testimonials, certifications, prices or contact details.`;
}

function knowledgeBase(b) {
  return `# ${b.businessName} Website Knowledge Base\n\n## Business\n- Industry: ${b.industry}\n- Location: ${b.location}\n- Primary goal: ${b.primaryGoal}\n- Audience: ${b.targetAudience || "Clarify with the owner"}\n- Services: ${b.services.length ? b.services.join(", ") : "Use clearly labelled placeholders"}\n\n## Brand system\n- Brand character: ${b.brandVibe}\n- Style preset: ${b.stylePreset || "minimalist"}\n- Colour direction: ${b.colours.length ? b.colours.join(", ") : "Accessible neutral foundation with one brand accent"}\n- Typography: readable modern sans-serif, strong hierarchy and comfortable line height.\n- Spacing: consistent 8px rhythm, generous section spacing and minimum 44px interactive targets.\n\n## Experience and components\nHeader and navigation; conversion-led hero; services; trust markers; about; testimonials placeholders; FAQ; contact; complete footer and legal links. Use ${b.layout || "simple-linear"} as the structural direction.\n\n## Content\nUse benefit-led, specific language. Never fabricate reviews, awards, staff, registrations, pricing or performance claims. Mark missing business facts as placeholders. Primary CTA: ${b.cta || "Contact us"}.\n\n## SEO\nOne descriptive H1, title under 60 characters, meta description under 160 characters, semantic landmarks, canonical metadata, Open Graph metadata, descriptive URLs and LocalBusiness schema placeholders for verified NAP data. Target the truthful phrase “${b.industry} in ${b.location}”.\n\n## Accessibility\nMeet WCAG 2.1 AA: keyboard operation, visible focus, semantic headings, labelled controls, descriptive alt text, contrast of at least 4.5:1 for normal text, reduced-motion support and accessible validation.\n\n## Security and privacy\nValidate on client and server, sanitise untrusted input, enforce HTTPS, use restrictive security headers, rate-limit forms, minimise collected data and obtain consent before non-essential tracking. Legal templates require owner or legal review.\n\n## Technical direction\nUse React, TypeScript, Tailwind and Vite unless the project requires otherwise. Optimise images, lazy-load below-fold media, avoid blocking third-party scripts, add analytics only with appropriate consent and keep secrets server-side.\n\n## Five-sprint roadmap\n1. Core responsive UI and design system.\n2. Verified content, services and conversion copy.\n3. Performance, SEO and accessibility validation.\n4. Forms, integrations and abuse protection.\n5. Cross-browser QA, analytics, monitoring and deployment readiness.`.slice(0, 10000);
}

function fullPrompt(b) {
  return `Build a production-oriented, responsive website for “${b.businessName}”, a ${b.industry} business serving ${b.location}.\n\nGoal: ${b.primaryGoal}\nBrand: ${b.brandVibe}\nAudience: ${b.targetAudience || "Use an appropriate local customer audience and leave uncertain details as placeholders"}\nServices: ${b.services.length ? b.services.join(", ") : "Create editable service placeholders based on the industry"}\nHeadline direction: ${b.headline || "Write a clear benefit-led headline"}\nPrimary CTA: ${b.cta || "Contact us"}\nLayout: ${b.layout || "simple-linear"}\nStyle preset: ${b.stylePreset || "minimalist"}\nColour direction: ${b.colours.length ? b.colours.join(", ") : "Choose an accessible palette aligned with the brand"}\nAdditional notes: ${b.notes || "None"}\n\nCreate a conversion-led hero, services, trust markers, about, testimonial placeholders, FAQ, contact and complete footer. Make it mobile-first and production-polished. Apply the supplied project knowledge for design system, truthful content, local SEO, WCAG 2.1 AA, privacy, security and the five-sprint roadmap. Do not fabricate business facts. Reference images are inspiration only and must not be copied deceptively.`;
}

function handoff(brief, tier, source = {}) {
  const full = tier === "full";
  return {
    schema: "oneclick.lovable-handoff", schemaVersion: "1.0.0", tier, source,
    brief,
    lovable: {
      initial_message: full ? fullPrompt(brief) : basicPrompt(brief),
      project_knowledge: full ? knowledgeBase(brief) : null,
      reference_image_urls: brief.referenceImages,
      recommended_follow_up: full ? "Set project knowledge, build, review, then iterate sprint by sprint." : "Build the lightweight draft and ask before adding production features."
    },
    quality: full ? { seo: true, accessibility: "WCAG 2.1 AA target", security: true, knowledgeBase: true, sprintRoadmap: true } : { seo: false, accessibility: false, security: false, knowledgeBase: false, sprintRoadmap: false },
    stateChanged: false
  };
}

export function prepareBasic(input) { return handoff(normaliseBrief(input), "basic", { kind: "chat_brief" }); }
export function prepareFull(input, source = { kind: "chat_brief" }) { return handoff(normaliseBrief(input), "full", source); }
export function fromSavedProject(row) {
  return prepareFull({
    business_name: row.business_name, industry: row.business_type, location: row.location, primary_goal: row.primary_goal,
    brand_vibe: row.brand_vibe, services: Array.isArray(row.services) ? row.services : [], target_audience: row.target_audience,
    additional_notes: row.extra_notes, style_preset: row.preset, reference_image_urls: row.image_urls || []
  }, { kind: "oneclick_saved_project", project_id: row.id });
}

