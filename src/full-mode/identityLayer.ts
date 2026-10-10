/**
 * Identity Layer Engine
 * Transforms user inputs into brand and content characteristics
 * Core intelligence that synthesizes inspiration + form data into cohesive identity
 */

import { getIndustryPackByType, type IndustryStarterPack } from './industryStarterPacks';
import { getRecommendedLayout, getLayoutPresetById, type LayoutPreset } from './layoutPresets';

/**
 * Input data for Identity Layer processing
 */
export interface IdentityLayerInput {
  // Form data
  businessName: string;
  businessType: string;
  location: string;
  primaryGoal: string;
  brandVibe: string;
  extraNotes?: string;
  targetAudience?: string;
  services?: string[];

  // Inspiration selections (optional)
  selectedIndustry?: string;
  selectedHeadline?: string;
  selectedCta?: string;
  selectedLayout?: string;
}

/**
 * Brand Tone derived from inputs
 */
export type BrandTone =
  | 'warm-friendly'
  | 'professional-trustworthy'
  | 'premium-sophisticated'
  | 'playful-energetic'
  | 'bold-confident'
  | 'calm-reassuring';

/**
 * Personality Level for content generation
 */
export type PersonalityLevel = 'minimal' | 'moderate' | 'expressive';

/**
 * Complexity Level for layout
 */
export type ComplexityLevel = 'simple' | 'standard' | 'detailed';

/**
 * Output from Identity Layer
 */
export interface IdentityLayerOutput {
  // Core identity traits
  brandTone: BrandTone;
  personalityLevel: PersonalityLevel;
  complexityLevel: ComplexityLevel;

  // Derived content
  primaryHeadline: string;
  secondaryTagline: string;
  primaryCta: string;
  secondaryCta: string;

  // Structure
  recommendedSections: string[];
  layoutPreset: LayoutPreset;

  // Industry context
  industryPack: IndustryStarterPack;
  trustMarkers: string[];
  vocabularyTerms: string[];

  // Visual direction
  colorTendency: 'warm' | 'cool' | 'neutral' | 'bold' | 'muted';
  typographyStyle: 'classic' | 'modern' | 'editorial' | 'minimal';

  // Raw data for prompt
  rawIdentityBlock: string;
}

/**
 * Derive brand tone from brand vibe input
 */
function deriveBrandTone(brandVibe: string): BrandTone {
  const normalized = brandVibe.toLowerCase();

  if (normalized.includes('friendly') || normalized.includes('welcoming') || normalized.includes('approachable')) {
    return 'warm-friendly';
  }
  if (normalized.includes('professional') || normalized.includes('trustworthy') || normalized.includes('reliable')) {
    return 'professional-trustworthy';
  }
  if (normalized.includes('premium') || normalized.includes('luxury') || normalized.includes('elegant') || normalized.includes('sophisticated')) {
    return 'premium-sophisticated';
  }
  if (normalized.includes('bold') || normalized.includes('confident') || normalized.includes('strong') || normalized.includes('powerful')) {
    return 'bold-confident';
  }
  if (normalized.includes('playful') || normalized.includes('fun') || normalized.includes('energetic') || normalized.includes('vibrant')) {
    return 'playful-energetic';
  }
  if (normalized.includes('calm') || normalized.includes('peaceful') || normalized.includes('serene') || normalized.includes('relaxing')) {
    return 'calm-reassuring';
  }

  // Default based on common business vibes
  return 'professional-trustworthy';
}

/**
 * Derive personality level from brand tone and goal
 */
function derivePersonalityLevel(brandTone: BrandTone, primaryGoal: string): PersonalityLevel {
  const goalNormalized = primaryGoal.toLowerCase();

  // High-personality tones
  if (brandTone === 'playful-energetic' || brandTone === 'bold-confident') {
    return 'expressive';
  }

  // Low-personality scenarios
  if (brandTone === 'professional-trustworthy' && goalNormalized.includes('lead')) {
    return 'moderate';
  }

  if (brandTone === 'premium-sophisticated' || brandTone === 'calm-reassuring') {
    return 'minimal';
  }

  return 'moderate';
}

/**
 * Derive complexity level from goal and industry
 */
function deriveComplexityLevel(primaryGoal: string, industryPack: IndustryStarterPack): ComplexityLevel {
  const goalNormalized = primaryGoal.toLowerCase();

  // Simple for basic goals
  if (goalNormalized.includes('simple') || goalNormalized.includes('basic') || goalNormalized.includes('portfolio')) {
    return 'simple';
  }

  // Detailed for conversion-heavy goals
  if (goalNormalized.includes('sales') || goalNormalized.includes('ecommerce') || goalNormalized.includes('booking')) {
    return 'detailed';
  }

  // Base on industry complexity
  if (industryPack.mustHaveSections.length > 6) {
    return 'detailed';
  }

  if (industryPack.mustHaveSections.length <= 4) {
    return 'simple';
  }

  return 'standard';
}

/**
 * Select best headline from industry pack or use custom
 */
function selectHeadline(
  input: IdentityLayerInput,
  industryPack: IndustryStarterPack
): { primary: string; secondary: string } {
  // If user selected a headline, use it
  if (input.selectedHeadline) {
    const index = industryPack.headlines.indexOf(input.selectedHeadline);
    return {
      primary: input.selectedHeadline,
      secondary: index >= 0 && industryPack.subheadlines[index]
        ? industryPack.subheadlines[index]
        : industryPack.subheadlines[0],
    };
  }

  // Default to first headline pair
  return {
    primary: industryPack.headlines[0],
    secondary: industryPack.subheadlines[0],
  };
}

/**
 * Select best CTA from industry pack or use custom
 */
function selectCtas(
  input: IdentityLayerInput,
  industryPack: IndustryStarterPack,
  primaryGoal: string
): { primary: string; secondary: string } {
  // If user selected a CTA, use it as primary
  if (input.selectedCta) {
    const remainingCtas = industryPack.ctas.filter(cta => cta !== input.selectedCta);
    return {
      primary: input.selectedCta,
      secondary: remainingCtas[0] || 'Learn More',
    };
  }

  // Goal-based CTA selection
  const goalNormalized = primaryGoal.toLowerCase();

  if (goalNormalized.includes('book') || goalNormalized.includes('appointment')) {
    const bookingCta = industryPack.ctas.find(cta =>
      cta.toLowerCase().includes('book') || cta.toLowerCase().includes('schedule')
    );
    if (bookingCta) {
      return {
        primary: bookingCta,
        secondary: industryPack.ctas.find(cta => cta !== bookingCta) || 'Learn More',
      };
    }
  }

  if (goalNormalized.includes('lead') || goalNormalized.includes('contact')) {
    const contactCta = industryPack.ctas.find(cta =>
      cta.toLowerCase().includes('contact') || cta.toLowerCase().includes('call') || cta.toLowerCase().includes('consult')
    );
    if (contactCta) {
      return {
        primary: contactCta,
        secondary: industryPack.ctas.find(cta => cta !== contactCta) || 'Learn More',
      };
    }
  }

  // Default
  return {
    primary: industryPack.ctas[0],
    secondary: industryPack.ctas[1] || 'Learn More',
  };
}

/**
 * Generate raw identity block for prompt injection
 */
function generateIdentityBlock(output: Omit<IdentityLayerOutput, 'rawIdentityBlock'>): string {
  return `
## Brand Identity Profile

### Core Identity
- **Brand Tone:** ${output.brandTone}
- **Personality Level:** ${output.personalityLevel}
- **Complexity Level:** ${output.complexityLevel}

### Messaging
- **Primary Headline:** "${output.primaryHeadline}"
- **Secondary Tagline:** "${output.secondaryTagline}"
- **Primary CTA:** "${output.primaryCta}"
- **Secondary CTA:** "${output.secondaryCta}"

### Industry Context
- **Industry:** ${output.industryPack.name}
- **Trust Markers to Include:** ${output.trustMarkers.join(', ')}
- **Key Vocabulary:** ${output.vocabularyTerms.slice(0, 4).join(', ')}

### Visual Direction
- **Color Tendency:** ${output.colorTendency}
- **Typography Style:** ${output.typographyStyle}
- **Layout:** ${output.layoutPreset.name} (${output.layoutPreset.structure.heroStyle} hero, ${output.layoutPreset.structure.contentFlow} flow)

### Section Structure
${output.recommendedSections.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`.trim();
}

/**
 * Main Identity Layer processor
 * Transforms raw inputs into comprehensive brand identity
 */
export function processIdentityLayer(input: IdentityLayerInput): IdentityLayerOutput {
  // Get industry starter pack
  const industryPack = input.selectedIndustry
    ? getIndustryPackByType(input.selectedIndustry)
    : getIndustryPackByType(input.businessType);

  // Derive core traits
  const brandTone = deriveBrandTone(input.brandVibe);
  const personalityLevel = derivePersonalityLevel(brandTone, input.primaryGoal);
  const complexityLevel = deriveComplexityLevel(input.primaryGoal, industryPack);

  // Get layout preset
  const layoutPreset = input.selectedLayout
    ? (getLayoutPresetById(input.selectedLayout) || getRecommendedLayout(industryPack.layoutTendency, input.brandVibe))
    : getRecommendedLayout(industryPack.layoutTendency, input.brandVibe);

  // Select headlines and CTAs
  const headlines = selectHeadline(input, industryPack);
  const ctas = selectCtas(input, industryPack, input.primaryGoal);

  // Build recommended sections (merge industry must-haves with layout order)
  const recommendedSections = [...new Set([
    ...layoutPreset.sectionOrder,
    ...industryPack.mustHaveSections,
  ])].slice(0, 8); // Cap at 8 sections

  // Build partial output
  const partialOutput = {
    brandTone,
    personalityLevel,
    complexityLevel,
    primaryHeadline: headlines.primary,
    secondaryTagline: headlines.secondary,
    primaryCta: ctas.primary,
    secondaryCta: ctas.secondary,
    recommendedSections,
    layoutPreset,
    industryPack,
    trustMarkers: industryPack.trustMarkers,
    vocabularyTerms: industryPack.vocabularyTerms,
    colorTendency: industryPack.colorTendency,
    typographyStyle: layoutPreset.visualCues.typography,
  };

  // Generate raw identity block for prompt
  const rawIdentityBlock = generateIdentityBlock(partialOutput);

  return {
    ...partialOutput,
    rawIdentityBlock,
  };
}

/**
 * Check if Identity Layer should be used (Full Mode only)
 */
export function shouldUseIdentityLayer(mode: 'basic' | 'full'): boolean {
  return mode === 'full';
}
