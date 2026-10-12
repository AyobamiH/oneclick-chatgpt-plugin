/**
 * Preset Library - Pet Care Website Styles
 * Each preset modifies tone, layout, typography, and brand energy in the prompt
 */

export interface WebsitePreset {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji for visual identification
  category: "grooming" | "spa" | "daycare" | "veterinary" | "general" | "modern" | "system" | "experimental" | "nostalgic" | "dark" | "expressive";

  // Styling instructions that get injected into the prompt
  styleInstructions: {
    tone: string;
    colorPalette: string;
    typography: string;
    layout: string;
    brandEnergy: string;
    imagery: string;
    animations: string;
  };

  // Additional prompt enhancements
  additionalFeatures?: string[];
}

export const PRESETS: WebsitePreset[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description:
      "Ultra-clean layouts with lots of whitespace, simple typography, and a tight color palette. Focused entirely on clarity and content.",
    icon: "🧼",
    category: "modern",
    styleInstructions: {
      tone: "Calm, confident, and efficient. No fluff — everything feels intentional and under control.",
      colorPalette:
        "Very limited palette: whites and soft grays (#F9FAFB, #E5E7EB) with one accent color (e.g. #111827 or #2563EB).",
      typography:
        "Modern sans-serif (Inter, system). Strong hierarchy with bold headings and highly readable body text (16–18px, 1.6 line height).",
      layout:
        "Spacious grid-based layout with generous margins and gutters. Clear section breaks and lots of negative space.",
      brandEnergy: "Clarity, precision, and trust. The interface should feel light, quiet, and distraction-free.",
      imagery:
        "Simple, high-quality images with minimal background detail. Prefer flat or softly lit photography over busy scenes.",
      animations:
        "Very subtle fades and slides. No bouncing or flashy motion. Micro-interactions should feel smooth and restrained.",
    },
    additionalFeatures: [
      "Plenty of whitespace around key sections",
      "Simple, monochrome iconography",
      "Minimal navigation with 3–5 core links",
      "Muted, low-noise background patterns or none at all",
    ],
  },
  {
    id: "flat-design",
    name: "Flat Design",
    description:
      "Crisp, two-dimensional UI with bright accents, clean shapes, and no skeuomorphic detail. Feels fast and digital-native.",
    icon: "📐",
    category: "modern",
    styleInstructions: {
      tone: "Direct, friendly, and contemporary. Feels like a modern app interface rather than a brochure.",
      colorPalette:
        "Solid, flat colors with clear contrasts. Use bright accent colors (#3B82F6, #F97316, #22C55E) against neutral backgrounds (#F3F4F6).",
      typography: "Geometric or clean sans-serif (Inter, Poppins, system). Bold headings with clear, short labels.",
      layout:
        "Block-based sections, clear cards, and simple shapes. Use color blocks to define areas instead of heavy borders.",
      brandEnergy:
        "Confident, efficient, and easy to parse at a glance. Everything should be scannable and uncluttered.",
      imagery: "Flat illustrations or minimal photography. Icons and simple vector graphics work very well here.",
      animations:
        "Snappy hover states and simple slide/fade transitions. Avoid depth-heavy motion; keep it light and responsive.",
    },
    additionalFeatures: [
      "Color-blocked hero and section backgrounds",
      "Icon-led feature cards",
      "Flat CTA buttons with clear hover states",
      "Simple badges for key labels and tags",
    ],
  },
  {
    id: "material-design",
    name: "Material Design",
    description:
      "Google-inspired layered cards, meaningful shadows, and bold accent colors with a structured system feel.",
    icon: "🧱",
    category: "system",
    styleInstructions: {
      tone: "Structured, trustworthy, and product-like. Feels like a polished SaaS dashboard or app.",
      colorPalette:
        "Surfaces in light neutrals (#F9FAFB, #FFFFFF) with strong primary accents (#2563EB, #0EA5E9). Controlled use of elevation shadows.",
      typography: "Robust sans-serif (Inter, Roboto). Clear typographic scale (caption, body, subtitle, H1–H3).",
      layout:
        "Card-based layout with clear elevation, section headers, and responsive grids. Strong focus on hierarchy and spacing.",
      brandEnergy: "Reliable and professional, with just enough warmth to feel approachable.",
      imagery: "UI mockups, dashboards, or abstract shapes. Clean imagery that suits product-style storytelling.",
      animations:
        "Material-style motion: purposeful, easing-driven transitions between states. Cards elevating, menus sliding, subtle ripple effects.",
    },
    additionalFeatures: [
      "Card-based sections with elevation levels",
      "Floating action-style primary CTA",
      "Clearly defined app-bar / toolbar patterns",
      "Chips and badges for filters and states",
    ],
  },
  {
    id: "brutalism",
    name: "Brutalism",
    description:
      "Raw, expressive layouts with stark typography, minimal polish, and deliberate friction. Designed to stand out.",
    icon: "🧨",
    category: "experimental",
    styleInstructions: {
      tone: "Bold, opinionated, and slightly rebellious. Feels like a statement, not a safe corporate site.",
      colorPalette:
        "High-contrast combinations: black/white (#000000, #FFFFFF) with one or two loud accent colors (#F97316, #FACC15, #EF4444).",
      typography: "Big, blocky type — mono or condensed fonts can work. Oversized headings, tight line height.",
      layout:
        "Blocky sections, visible grid or even anti-grid. Intentionally uneven spacing that still maintains readability.",
      brandEnergy: "Unpolished on purpose. Honest, direct, and a bit disruptive.",
      imagery: "High-contrast photos, gritty textures, or bold line art. Can also be extremely sparse with only type.",
      animations:
        "Minimal, if any. When used, they should be abrupt: sharp cuts, instant state changes rather than soft fades.",
    },
    additionalFeatures: [
      "Large, typography-led hero",
      "Full-width blocks with clashing backgrounds",
      "Bare, text-only buttons or links",
      "Grid lines or simple borders that feel intentionally rough",
    ],
  },
  {
    id: "skeuomorphism",
    name: "Skeuomorphism",
    description: "Interfaces that mimic real-world objects with textures, gradients, and physically inspired controls.",
    icon: "📓",
    category: "nostalgic",
    styleInstructions: {
      tone: "Warm, familiar, and slightly nostalgic. Feels like something you can touch.",
      colorPalette:
        "Rich, material-inspired tones: creams, leathers, metallics, or paper-like whites with subtle gradients.",
      typography: "Friendly serif or rounded sans-serif fonts. Think editorial meets classic app UI.",
      layout: "Panels and cards that resemble real surfaces. Clear edges, borders, and layered sections with shadows.",
      brandEnergy: "Comforting and approachable, leaning into familiarity and physical metaphors.",
      imagery: "Photography or illustrations that support the physical feel: notebooks, desks, tools, devices.",
      animations: "Gentle transitions, subtle ‘press’ states on buttons, and natural easing that feels tactile.",
    },
    additionalFeatures: [
      "Buttons with highlight + shadow to imply depth",
      "Textured backgrounds (very subtle, not noisy)",
      "Card edges with gradients or bevel effects",
      "Toggle switches or sliders that mimic physical controls",
    ],
  },
  {
    id: "neumorphism",
    name: "Neumorphism (Soft UI)",
    description: "Soft, extruded surfaces where components look pressed into or floating above the background.",
    icon: "💿",
    category: "experimental",
    styleInstructions: {
      tone: "Futuristic yet gentle. Almost tactile, but very clean and minimal.",
      colorPalette:
        "Low-contrast background shades (#E5E7EB, #F3F4F6) with soft shadows and one or two accent colors (#6366F1, #22C55E).",
      typography: "Clean sans-serif with medium weights. Rounded corners, generous line height.",
      layout: "Large, softly rounded cards and controls. Plenty of breathing room between interactive elements.",
      brandEnergy: "Premium and slightly futuristic, with an emphasis on subtle depth.",
      imagery: "Minimal UI mockups, soft gradients, or light 3D renders. Avoid busy photography.",
      animations: "Smooth hover state changes where elements appear to lift or depress. Slow, soft easing curves.",
    },
    additionalFeatures: [
      "Soft, dual-shadow buttons and cards",
      "Large toggle switches and pill-shaped controls",
      "Central, spotlight-style hero components",
      "Careful contrast tuning for accessibility",
    ],
  },
  {
    id: "retro-vintage",
    name: "Retro / Vintage",
    description: "Throwback visuals inspired by a chosen decade, with vintage typography, textures, and color schemes.",
    icon: "📼",
    category: "nostalgic",
    styleInstructions: {
      tone: "Playful, warm, and characterful. Feels like a nod to a specific era without being kitsch.",
      colorPalette: "Muted tones and era-specific combinations (70s earth tones, 80s neons, 90s pastels).",
      typography: "Period-inspired type: slab serifs, script fonts, or pixel fonts depending on decade.",
      layout: "Poster-like compositions with strong headings, decorative dividers, and asymmetric blocks.",
      brandEnergy: "Distinctive and memorable, leaning into nostalgia in a controlled, intentional way.",
      imagery: "Grainy photos, halftone textures, or pixel/illustration styles that match the era.",
      animations: "Subtle analog glitches, slide-ins, or retro transitions. Nothing too slick; keep some charm.",
    },
    additionalFeatures: [
      "Era-inspired badges and labels",
      "Subtle grain or noise overlays on sections",
      "Decorative borders or frames for images",
      "Accent patterns (stripes, grids, dots) matching the chosen decade",
    ],
  },
  {
    id: "gothic-dark",
    name: "Gothic / Dark Mode",
    description: "High-contrast dark interface with dramatic typography and glowing accents on a deep background.",
    icon: "🌘",
    category: "dark",
    styleInstructions: {
      tone: "Bold, cinematic, and focused. Feels like a serious, high-end product or creative studio.",
      colorPalette:
        "Dark grays and blacks (#020617, #030712, #111827) with bright accent colors (#E11D48, #6366F1, #22D3EE).",
      typography:
        "Strong, high-contrast type. Mix of sharp sans-serif for UI and display faces for headings if desired.",
      layout:
        "Clear vertical rhythm with strong section breaks. Use light dividers and subtle glows to separate content.",
      brandEnergy: "Mysterious but controlled. High-impact visuals with careful use of light and color.",
      imagery: "Moody photography, dark UI mockups, or abstract gradients against the dark canvas.",
      animations:
        "Soft fades and glows, with occasional spotlight-style reveal effects. Motion should feel smooth and cinematic.",
    },
    additionalFeatures: [
      "Dark-mode friendly cards and inputs",
      "Glow effects for key CTAs and icons",
      "Accent borders or lines in neon/focused colors",
      "Accessible contrast ratios for all text",
    ],
  },
  {
    id: "maximalism",
    name: "Maximalism",
    description:
      "Dense, vibrant layouts full of pattern, color, and visual detail. Designed to feel rich and energetic.",
    icon: "🎨",
    category: "expressive",
    styleInstructions: {
      tone: "Loud, expressive, and joyful. Embraces visual complexity while still guiding the eye.",
      colorPalette: "Multiple bold colors used together: bright primaries, gradients, and layered patterns.",
      typography: "Big, expressive headings (display or decorative fonts) paired with a solid, readable body font.",
      layout:
        "Layered sections with overlapping elements, stickers, and accents. Clear CTAs even amid visual richness.",
      brandEnergy: "Creative, daring, and full of personality. The page should feel like a visual experience.",
      imagery: "Collages, illustrations, stickers, and busy compositions. Photography can be heavily art-directed.",
      animations:
        "Playful micro-interactions, parallax, and staggered reveals. Keep performance in mind while embracing motion.",
    },
    additionalFeatures: [
      "Multiple decorative shapes and stickers around content",
      "Layered cards that overlap or tilt slightly",
      "Animated accents (icons, underlines, or confetti-style details)",
      "Bold section transitions using color and pattern",
    ],
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): WebsitePreset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: WebsitePreset["category"]): WebsitePreset[] {
  return PRESETS.filter((preset) => preset.category === category);
}

/**
 * Generate prompt instructions from preset
 */
export function generatePresetInstructions(preset: WebsitePreset): string {
  const { styleInstructions, additionalFeatures } = preset;

  let instructions = `## Selected Style Preset: ${preset.name}

### Design System Instructions

**Tone & Voice:**
${styleInstructions.tone}

**Color Palette:**
${styleInstructions.colorPalette}

**Typography:**
${styleInstructions.typography}

**Layout Style:**
${styleInstructions.layout}

**Brand Energy:**
${styleInstructions.brandEnergy}

**Imagery Guidelines:**
${styleInstructions.imagery}

**Animation & Interactions:**
${styleInstructions.animations}`;

  if (additionalFeatures && additionalFeatures.length > 0) {
    instructions += `\n\n**Recommended Features:**\n${additionalFeatures.map((f) => `- ${f}`).join("\n")}`;
  }

  return instructions;
}
