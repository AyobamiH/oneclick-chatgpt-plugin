/**
 * Layout Presets
 * Structural templates for different website styles
 * Defines section order, visual structure, and layout characteristics
 */

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  structure: {
    heroStyle: 'centered' | 'split' | 'fullscreen' | 'minimal' | 'editorial';
    contentFlow: 'linear' | 'grid' | 'asymmetric' | 'magazine';
    sectionSpacing: 'compact' | 'normal' | 'generous';
    visualDensity: 'sparse' | 'balanced' | 'dense';
  };
  sectionOrder: string[];
  characteristics: string[];
  bestFor: string[];
  visualCues: {
    typography: 'classic' | 'modern' | 'editorial' | 'minimal';
    imageStyle: 'full-bleed' | 'contained' | 'overlapping' | 'minimal';
    whitespace: 'minimal' | 'moderate' | 'generous';
    animations: 'none' | 'subtle' | 'moderate' | 'expressive';
  };
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'simple-linear',
    name: 'Simple Linear',
    description: 'Clean, straightforward top-to-bottom flow with clear sections',
    structure: {
      heroStyle: 'centered',
      contentFlow: 'linear',
      sectionSpacing: 'normal',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'services', 'about', 'testimonials', 'contact'],
    characteristics: [
      'Easy to navigate',
      'Clear visual hierarchy',
      'Mobile-friendly by default',
      'Quick to build',
    ],
    bestFor: ['Local services', 'Small businesses', 'Tradespersons', 'First websites'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'contained',
      whitespace: 'moderate',
      animations: 'subtle',
    },
  },
  {
    id: 'corporate-grid',
    name: 'Corporate Grid',
    description: 'Professional, structured layout with grid-based sections',
    structure: {
      heroStyle: 'split',
      contentFlow: 'grid',
      sectionSpacing: 'normal',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'features', 'services', 'case-studies', 'team', 'testimonials', 'cta', 'contact'],
    characteristics: [
      'Professional appearance',
      'Feature-rich layout',
      'Trust-building structure',
      'Conversion optimized',
    ],
    bestFor: ['Agencies', 'Consultants', 'B2B services', 'Professional services'],
    visualCues: {
      typography: 'classic',
      imageStyle: 'contained',
      whitespace: 'moderate',
      animations: 'subtle',
    },
  },
  {
    id: 'creative-story',
    name: 'Creative Story',
    description: 'Portfolio-style layout with storytelling flow and visual impact',
    structure: {
      heroStyle: 'fullscreen',
      contentFlow: 'asymmetric',
      sectionSpacing: 'generous',
      visualDensity: 'sparse',
    },
    sectionOrder: ['hero', 'portfolio', 'process', 'about', 'testimonials', 'contact'],
    characteristics: [
      'Visual-first design',
      'Storytelling approach',
      'Portfolio showcase',
      'Memorable impression',
    ],
    bestFor: ['Designers', 'Photographers', 'Artists', 'Creative agencies'],
    visualCues: {
      typography: 'editorial',
      imageStyle: 'full-bleed',
      whitespace: 'generous',
      animations: 'expressive',
    },
  },
  {
    id: 'premium-luxury',
    name: 'Premium Luxury',
    description: 'High-end aesthetic with refined typography and elegant spacing',
    structure: {
      heroStyle: 'minimal',
      contentFlow: 'linear',
      sectionSpacing: 'generous',
      visualDensity: 'sparse',
    },
    sectionOrder: ['hero', 'intro', 'services', 'gallery', 'testimonials', 'about', 'contact'],
    characteristics: [
      'Refined elegance',
      'Premium feel',
      'Minimalist approach',
      'High-quality imagery focus',
    ],
    bestFor: ['Luxury brands', 'Premium services', 'Salons/spas', 'High-end retail'],
    visualCues: {
      typography: 'classic',
      imageStyle: 'full-bleed',
      whitespace: 'generous',
      animations: 'subtle',
    },
  },
  {
    id: 'local-service',
    name: 'Local Service',
    description: 'Trust-focused layout optimized for local business conversion',
    structure: {
      heroStyle: 'split',
      contentFlow: 'linear',
      sectionSpacing: 'compact',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'trust-badges', 'services', 'service-areas', 'testimonials', 'about', 'contact'],
    characteristics: [
      'Trust-building elements',
      'Clear service areas',
      'Easy contact access',
      'Local SEO optimized',
    ],
    bestFor: ['Tradespersons', 'Local services', 'Home services', 'Contractors'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'contained',
      whitespace: 'minimal',
      animations: 'none',
    },
  },
  {
    id: 'modern-editorial',
    name: 'Modern Editorial',
    description: 'Magazine-style layout with bold typography and dynamic sections',
    structure: {
      heroStyle: 'editorial',
      contentFlow: 'magazine',
      sectionSpacing: 'normal',
      visualDensity: 'dense',
    },
    sectionOrder: ['hero', 'featured', 'grid-content', 'articles', 'testimonials', 'newsletter', 'contact'],
    characteristics: [
      'Bold typography',
      'Dynamic layouts',
      'Content-rich design',
      'Magazine feel',
    ],
    bestFor: ['Media', 'Blogs', 'Content creators', 'News sites'],
    visualCues: {
      typography: 'editorial',
      imageStyle: 'overlapping',
      whitespace: 'moderate',
      animations: 'moderate',
    },
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    description: 'Modern grid-based layout with varied card sizes inspired by Apple design',
    structure: {
      heroStyle: 'minimal',
      contentFlow: 'grid',
      sectionSpacing: 'compact',
      visualDensity: 'dense',
    },
    sectionOrder: ['hero', 'feature-grid', 'highlights', 'stats', 'testimonials', 'cta'],
    characteristics: [
      'Varied card sizes',
      'Visual hierarchy through scale',
      'Modern tech aesthetic',
      'Information-dense but clean',
    ],
    bestFor: ['Tech products', 'SaaS', 'Portfolios', 'Feature showcases'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'contained',
      whitespace: 'minimal',
      animations: 'subtle',
    },
  },
  {
    id: 'split-screen',
    name: 'Split Screen Hero',
    description: 'Bold 50/50 split layouts with strong visual impact',
    structure: {
      heroStyle: 'split',
      contentFlow: 'asymmetric',
      sectionSpacing: 'generous',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'intro', 'split-features', 'testimonials', 'about', 'cta', 'contact'],
    characteristics: [
      'Strong visual balance',
      'Image and text harmony',
      'Clear content separation',
      'Impactful first impression',
    ],
    bestFor: ['Fashion', 'Architecture', 'Real estate', 'Premium services'],
    visualCues: {
      typography: 'classic',
      imageStyle: 'full-bleed',
      whitespace: 'generous',
      animations: 'subtle',
    },
  },
  {
    id: 'immersive-fullscreen',
    name: 'Immersive Fullscreen',
    description: 'Full-screen sections with scroll-triggered reveals and cinematic feel',
    structure: {
      heroStyle: 'fullscreen',
      contentFlow: 'linear',
      sectionSpacing: 'generous',
      visualDensity: 'sparse',
    },
    sectionOrder: ['hero', 'story', 'features', 'gallery', 'testimonials', 'cta'],
    characteristics: [
      'Cinematic experience',
      'Full-screen sections',
      'Scroll-based storytelling',
      'Maximum visual impact',
    ],
    bestFor: ['Luxury brands', 'Hotels', 'Automotive', 'Film/Entertainment'],
    visualCues: {
      typography: 'editorial',
      imageStyle: 'full-bleed',
      whitespace: 'generous',
      animations: 'expressive',
    },
  },
  {
    id: 'card-modular',
    name: 'Card-Based Modular',
    description: 'Flexible card system that adapts to any content type',
    structure: {
      heroStyle: 'centered',
      contentFlow: 'grid',
      sectionSpacing: 'normal',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'card-features', 'services', 'team', 'testimonials', 'pricing', 'contact'],
    characteristics: [
      'Modular and flexible',
      'Easy to scan',
      'Consistent rhythm',
      'Scalable design system',
    ],
    bestFor: ['Agencies', 'Startups', 'Product pages', 'Service directories'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'contained',
      whitespace: 'moderate',
      animations: 'subtle',
    },
  },
  {
    id: 'timeline-journey',
    name: 'Timeline Journey',
    description: 'Narrative-driven layout perfect for showcasing process or history',
    structure: {
      heroStyle: 'centered',
      contentFlow: 'linear',
      sectionSpacing: 'generous',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'intro', 'timeline', 'milestones', 'testimonials', 'about', 'cta'],
    characteristics: [
      'Story-driven structure',
      'Clear progression',
      'Milestone highlights',
      'Emotional connection',
    ],
    bestFor: ['About pages', 'Company history', 'Process showcase', 'Personal brands'],
    visualCues: {
      typography: 'classic',
      imageStyle: 'contained',
      whitespace: 'generous',
      animations: 'moderate',
    },
  },
  {
    id: 'dark-premium',
    name: 'Dark Mode Premium',
    description: 'Sophisticated dark theme with accent colors and luxury feel',
    structure: {
      heroStyle: 'minimal',
      contentFlow: 'linear',
      sectionSpacing: 'generous',
      visualDensity: 'sparse',
    },
    sectionOrder: ['hero', 'features', 'showcase', 'testimonials', 'pricing', 'cta'],
    characteristics: [
      'Premium dark aesthetic',
      'High-contrast accents',
      'Sophisticated feel',
      'Evening/luxury mood',
    ],
    bestFor: ['Tech products', 'Luxury goods', 'Night venues', 'Premium SaaS'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'contained',
      whitespace: 'generous',
      animations: 'subtle',
    },
  },
  {
    id: 'interactive-animated',
    name: 'Interactive Animated',
    description: 'Motion-rich design with micro-interactions and scroll animations',
    structure: {
      heroStyle: 'fullscreen',
      contentFlow: 'linear',
      sectionSpacing: 'normal',
      visualDensity: 'balanced',
    },
    sectionOrder: ['hero', 'animated-features', 'interactive-demo', 'testimonials', 'cta'],
    characteristics: [
      'Engaging animations',
      'Interactive elements',
      'Memorable experience',
      'Modern and playful',
    ],
    bestFor: ['Creative agencies', 'Tech startups', 'Games', 'Innovation brands'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'overlapping',
      whitespace: 'moderate',
      animations: 'expressive',
    },
  },
  {
    id: 'minimal-swiss',
    name: 'Minimal Swiss',
    description: 'Clean Swiss-style design with strong grid and typography focus',
    structure: {
      heroStyle: 'minimal',
      contentFlow: 'linear',
      sectionSpacing: 'generous',
      visualDensity: 'sparse',
    },
    sectionOrder: ['hero', 'intro', 'services', 'work', 'about', 'contact'],
    characteristics: [
      'Typography-first',
      'Strong grid system',
      'Maximum clarity',
      'Timeless elegance',
    ],
    bestFor: ['Design studios', 'Architects', 'Publishers', 'Professional services'],
    visualCues: {
      typography: 'modern',
      imageStyle: 'minimal',
      whitespace: 'generous',
      animations: 'none',
    },
  },
];

/**
 * Get layout preset by ID
 */
export function getLayoutPresetById(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find(preset => preset.id === id);
}

/**
 * Get layout preset recommendation based on industry and brand vibe
 */
export function getRecommendedLayout(
  industryTendency: 'minimal' | 'corporate' | 'creative' | 'premium' | 'local',
  brandVibe: string
): LayoutPreset {
  const vibeNormalized = brandVibe.toLowerCase();

  // Map brand vibes to layout preferences
  if (vibeNormalized.includes('premium') || vibeNormalized.includes('luxury') || vibeNormalized.includes('elegant')) {
    return LAYOUT_PRESETS.find(p => p.id === 'premium-luxury')!;
  }

  if (vibeNormalized.includes('creative') || vibeNormalized.includes('playful') || vibeNormalized.includes('artistic')) {
    return LAYOUT_PRESETS.find(p => p.id === 'creative-story')!;
  }

  if (vibeNormalized.includes('bold') || vibeNormalized.includes('modern') || vibeNormalized.includes('editorial')) {
    return LAYOUT_PRESETS.find(p => p.id === 'modern-editorial')!;
  }

  // Fall back to industry tendency
  const industryLayoutMap: Record<string, string> = {
    minimal: 'simple-linear',
    corporate: 'corporate-grid',
    creative: 'creative-story',
    premium: 'premium-luxury',
    local: 'local-service',
  };

  const layoutId = industryLayoutMap[industryTendency] || 'simple-linear';
  return LAYOUT_PRESETS.find(p => p.id === layoutId)!;
}

/**
 * Get all layout presets
 */
export function getAllLayoutPresets(): LayoutPreset[] {
  return LAYOUT_PRESETS;
}

/**
 * Generate layout instructions for prompt
 */
export function generateLayoutInstructions(preset: LayoutPreset): string {
  return `
### Layout Structure: ${preset.name}
${preset.description}

**Hero Style:** ${preset.structure.heroStyle}
**Content Flow:** ${preset.structure.contentFlow}
**Section Spacing:** ${preset.structure.sectionSpacing}
**Visual Density:** ${preset.structure.visualDensity}

**Recommended Section Order:**
${preset.sectionOrder.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Visual Guidelines:**
- Typography: ${preset.visualCues.typography}
- Image Style: ${preset.visualCues.imageStyle}
- Whitespace: ${preset.visualCues.whitespace}
- Animations: ${preset.visualCues.animations}

**Key Characteristics:**
${preset.characteristics.map(c => `- ${c}`).join('\n')}
`.trim();
}
