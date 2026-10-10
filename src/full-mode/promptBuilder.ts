/**
 * Prompt Builder Engine
 * Deterministic builder that assembles the final prompt for Lovable Build-with-URL
 * Enhanced with Identity Layer integration for Full Mode
 */

import { getPresetById, generatePresetInstructions } from './presets';
import { processIdentityLayer, shouldUseIdentityLayer, type IdentityLayerOutput } from './identityLayer';
import { generateLayoutInstructions } from './layoutPresets';

export interface BusinessFormData {
  businessName: string;
  businessType: string;
  businessTypeId?: string; // Canonical pack.id from INDUSTRY_STARTER_PACKS
  location: string;
  primaryGoal: string;
  brandVibe: string;
  extraNotes: string;
  referenceUrl?: string; // Optional reference URL for inspiration
  imageUrls: string[];
  preset?: string; // Optional preset ID for Full Mode
  // Sprint 22: Wizard fields
  services?: string[];
  targetAudience?: string;
  goals?: string;
  colorPalette?: string[];
  // Identity Layer selections (Full Mode)
  selectedIndustry?: string;
  selectedHeadline?: string;
  selectedCta?: string;
  selectedLayout?: string;
}

/**
 * Build prompt with optional Identity Layer integration
 */
export function buildPrompt(data: BusinessFormData, mode: 'basic' | 'full' = 'basic'): string {
  const {
    businessName,
    businessType,
    location,
    primaryGoal,
    brandVibe,
    extraNotes,
    preset,
  } = data;

  // BASIC MODE: Simplified prompt without SEO, accessibility, security, KB, or sprints
  // But now includes inspiration selections if provided
  if (mode === 'basic') {
    // Build inspiration block if selections exist
    let inspirationBlock = '';
    if (data.selectedIndustry || data.selectedHeadline || data.selectedCta || data.selectedLayout) {
      const inspirationParts: string[] = [];
      if (data.selectedIndustry) inspirationParts.push(`Industry focus: ${data.selectedIndustry}`);
      if (data.selectedHeadline) inspirationParts.push(`Headline style: "${data.selectedHeadline}"`);
      if (data.selectedCta) inspirationParts.push(`Call-to-action: "${data.selectedCta}"`);
      if (data.selectedLayout) inspirationParts.push(`Layout preference: ${data.selectedLayout}`);

      if (inspirationParts.length > 0) {
        inspirationBlock = `\nInspiration preferences:\n${inspirationParts.map(p => `- ${p}`).join('\n')}\n`;
      }
    }

    let prompt = `Build a simple, responsive, single-page website draft for a business called "${businessName}".

Business type: ${businessType}
Location: ${location}
${data.referenceUrl ? `\nReference URL for inspiration: ${data.referenceUrl}` : ''}
${inspirationBlock}
The site should include:
- A clean hero section with headline and supporting text.${data.selectedHeadline ? ` Use "${data.selectedHeadline}" as inspiration for the headline.` : ''}
- A short description of the business.
- A simple list of services.
- A basic contact section.${data.selectedCta ? ` Use "${data.selectedCta}" for the main call-to-action button.` : ''}

Style:
- Light, neutral design.
- Minimal layout.${data.selectedLayout ? ` Prefer a ${data.selectedLayout} layout style.` : ''}
- No animations.
- No SEO features.
- No accessibility or security requirements.
- No advanced layout components.
- No industry-specific structure.

Keep the output lightweight, generic, and suitable for a quick idea draft.${extraNotes ? `\n\nAdditional notes: ${extraNotes}` : ''}`;
    return prompt;
  }

  // FULL MODE: Production-ready prompt with all features
  // Process Identity Layer for enhanced brand intelligence
  const identityOutput: IdentityLayerOutput | null = shouldUseIdentityLayer(mode)
    ? processIdentityLayer({
        businessName,
        businessType,
        location,
        primaryGoal,
        brandVibe,
        extraNotes,
        targetAudience: data.targetAudience,
        services: data.services,
        selectedIndustry: data.selectedIndustry,
        selectedHeadline: data.selectedHeadline,
        selectedCta: data.selectedCta,
        selectedLayout: data.selectedLayout,
      })
    : null;

  // Inject preset instructions if selected
  const presetInstructions = preset ? generatePresetInstructions(getPresetById(preset)!) : '';

  // Generate layout instructions from Identity Layer
  const layoutInstructions = identityOutput
    ? generateLayoutInstructions(identityOutput.layoutPreset)
    : '';

  let prompt = `# Website Draft Request for ${businessName}

## Business Information
- **Business Name**: ${businessName}
- **Industry**: ${businessType}
- **Location**: ${location}
- **Primary Goal**: ${primaryGoal}
- **Brand Style**: ${brandVibe}
${data.targetAudience ? `- **Target Audience**: ${data.targetAudience}` : ''}
${data.services && data.services.length > 0 ? `\n### Services Offered\n${data.services.map(s => `- ${s}`).join('\n')}` : ''}
${data.goals ? `\n### Website Goals\n${data.goals}` : ''}
${data.colorPalette && data.colorPalette.length > 0 ? `\n### Color Palette\n${data.colorPalette.join(', ')}` : ''}

${identityOutput ? identityOutput.rawIdentityBlock + '\n' : ''}
${layoutInstructions ? layoutInstructions + '\n' : ''}
${presetInstructions ? presetInstructions + '\n' : ''}

## Requirements

### Structure & Layout
- Create a modern, responsive website with clear navigation
${identityOutput ? `- Use a ${identityOutput.layoutPreset.structure.heroStyle} hero style with ${identityOutput.layoutPreset.structure.contentFlow} content flow` : '- Include a compelling hero section with strong call-to-action'}
${identityOutput ? `- Primary CTA: "${identityOutput.primaryCta}"` : '- Add relevant service/product sections based on the business type'}
${identityOutput ? `- Secondary CTA: "${identityOutput.secondaryCta}"` : ''}
- Include an about section highlighting the business's unique value
- Add a contact section with clear contact information
- Ensure mobile-first responsive design

### Accessibility (WCAG AA Compliance)
- All images must have descriptive alt text
- Proper heading hierarchy (H1 → H2 → H3)
- Sufficient color contrast ratios (minimum 4.5:1 for normal text)
- Keyboard navigable interface
- Clear focus indicators on interactive elements
- ARIA labels where appropriate
- Minimum 48px tap targets for mobile

### SEO Best Practices
- Semantic HTML5 structure (<header>, <main>, <nav>, <section>, <footer>)
- Single H1 tag with primary keyword
- Meta description under 160 characters
- Descriptive page title under 60 characters
- Image optimization with proper alt attributes
- Internal linking structure
- Fast page load performance

### Brand & Design
${identityOutput ? `- Brand Tone: ${identityOutput.brandTone}` : '- Professional, trustworthy design aesthetic'}
${identityOutput ? `- Typography Style: ${identityOutput.typographyStyle}` : '- Clean, modern layout without overwhelming effects'}
${identityOutput ? `- Color Tendency: ${identityOutput.colorTendency}` : `- Color scheme appropriate for the ${businessType} industry`}
- Brand personality reflecting: ${brandVibe}
- Clear typography hierarchy
- Ample whitespace for readability
${identityOutput ? `\n**Trust Markers to Include:**\n${identityOutput.trustMarkers.map(t => `- ${t}`).join('\n')}` : ''}
- Benefit-driven copy focusing on customer needs
- Trust signals and social proof where appropriate
- Strong call-to-action buttons
- Contact information easily accessible

${extraNotes ? `\n### Additional Notes\n${extraNotes}\n` : ''}

### Full Mode Production Enhancements

#### SEO Enforcement
- Include JSON-LD LocalBusiness schema with business name, type, and location
- Add meta title and description optimized for "${businessType} in ${location}"
- Implement Open Graph tags for social sharing
- Ensure fast Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Use semantic HTML5 with proper heading hierarchy
- Add descriptive alt text for all images

#### Accessibility Enforcement (WCAG 2.1 AA)
- Ensure keyboard navigation works throughout
- Maintain color contrast ratios of at least 4.5:1
- Add ARIA labels and landmarks where appropriate
- Implement skip navigation links
- Ensure all interactive elements have visible focus states
- Respect prefers-reduced-motion for animations

#### Security Best Practices
- Implement proper form validation
- Use HTTPS for all external resources
- Add CSP (Content Security Policy) headers
- Sanitize all user inputs
- Follow secure coding practices

#### Production Polish
- Professional, agency-quality design
- Industry-specific component structure
- Placeholder testimonials section
- Clear service/offering presentations
- Strong brand personality throughout
- Optimized for conversion and user engagement

#### Compliance & Legal Requirements
Implement the following compliance features to help meet basic legal and regulatory standards:

**1. Cookie Notice & Tracking Compliance:**
- Add a clear, non-intrusive cookie consent banner at the bottom of the page
- Include basic cookie policy text explaining what cookies are used and why
- Provide accept/decline functionality for non-essential cookies
- Link to a full Cookie Policy page

**2. Data Protection & Privacy:**
- Create a Privacy Policy page template with sections for:
  - What data is collected
  - How data is used and stored
  - User rights under GDPR/privacy laws
  - Contact information for privacy inquiries
- Include a clear link to Privacy Policy in the footer
- Add privacy notice near any data collection forms (contact forms, newsletter signups)

**3. Company/Business Information Scaffolding:**
- Include a complete footer section with:
  - Business name: ${businessName}
  - Business type: ${businessType}
  - Location: ${location}
  - Placeholder for registration number (if applicable)
  - Placeholder for VAT number (if applicable in ${location})
  - Contact email and phone placeholders

**4. Online Safety Standards:**
- Implement secure form handling with HTTPS
- Add CAPTCHA or honeypot fields to prevent spam
- Include clear security indicators (padlock icon references)
- Add "Report a problem" or "Report abuse" link in footer

**5. Content Responsibility:**
- Add Terms of Service page template with sections for:
  - Acceptable use policy
  - Content ownership and copyright
  - Disclaimer of warranties
  - Limitation of liability
- Include copyright notice in footer: "© ${new Date().getFullYear()} ${businessName}. All rights reserved."
- Add clear content attribution where third-party content is used

**6. Marketing Email & Direct Messaging Rules:**
- For any newsletter signup or contact forms:
  - Include explicit consent checkbox for marketing communications
  - Add unsubscribe instructions near signup
  - Include "We respect your privacy" message
  - Link to Email Preferences or Communication Preferences page template
- Add text: "By submitting this form, you agree to receive communications from ${businessName}. You can unsubscribe at any time."

**Note:** These templates and scaffolding provide a starting point for legal compliance. Users should review and customize these sections with their legal advisor to ensure full compliance with applicable laws in ${location}.

#### Knowledge Base Generation
Create a comprehensive Knowledge Base document for this project that includes:

**Design System:**
- Color palette recommendations aligned with ${brandVibe} style
- Typography hierarchy and font pairings
- Spacing and layout grid system
- Component style guidelines
- Responsive breakpoints strategy

**Content Guidelines:**
- Tone of voice aligned with ${brandVibe} brand personality
- Key messaging pillars for ${businessType} industry
- SEO keyword strategy for ${location} market
- Content structure best practices
- Call-to-action wording recommendations

**Technical Architecture:**
- Recommended tech stack for ${primaryGoal}
- Performance optimization checklist
- Security implementation guidelines
- Analytics and tracking setup
- Third-party integration suggestions

**Accessibility Standards:**
- WCAG 2.1 AA compliance checklist
- Keyboard navigation requirements
- Screen reader optimization guidelines
- Color contrast requirements
- Form validation standards

**SEO Strategy:**
- Local SEO optimization for ${location}
- Schema markup requirements
- Meta tag templates
- Internal linking structure
- Page performance targets

This Knowledge Base should serve as the source of truth for all future development on this project.

#### Next 5 Production Sprints Roadmap
1. **Sprint 1: UI/UX Enhancement** - Refine animations, micro-interactions, and visual hierarchy
2. **Sprint 2: Content & Copy** - Add real testimonials, detailed service descriptions, case studies
3. **Sprint 3: Performance Optimization** - Image optimization, lazy loading, caching strategies
4. **Sprint 4: Advanced Features** - Contact forms, booking systems, live chat integration
5. **Sprint 5: Launch Preparation** - Final testing, analytics setup, monitoring, and deployment

## Deliverable
A production-ready, fully-featured website draft that is accessible, SEO-optimized, secure, and professionally polished, aligned with the business goals and brand identity outlined above.`;

  return prompt;
}

/**
 * Validate form data before building prompt
 */
export function validateFormData(data: Partial<BusinessFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.businessName?.trim()) {
    errors.businessName = "Business name is required";
  } else if (data.businessName.length > 100) {
    errors.businessName = "Business name must be less than 100 characters";
  }

  if (!data.businessType?.trim()) {
    errors.businessType = "Business type is required";
  }

  if (!data.location?.trim()) {
    errors.location = "Location is required";
  }

  if (!data.primaryGoal?.trim()) {
    errors.primaryGoal = "Primary goal is required";
  }

  if (!data.brandVibe?.trim()) {
    errors.brandVibe = "Brand vibe is required";
  }

  if (data.extraNotes && data.extraNotes.length > 1000) {
    errors.extraNotes = "Additional notes must be less than 1000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Build the final Lovable URL with encoded prompt and images
 */
export function buildLovableUrl(prompt: string, imageUrls: string[], mode: 'basic' | 'full'): string {
  // Validate and potentially truncate prompt if too long
  const MAX_URL_LENGTH = 8000;
  let finalPrompt = prompt;

  // Test if URL will be too long
  const testUrl = `https://lovable.dev/?autosubmit=true#prompt=${encodeURIComponent(prompt)}`;
  if (testUrl.length > MAX_URL_LENGTH) {
    // Truncate extra notes section if present
    const truncateWarning = "\n\n[Note: Additional notes were truncated due to length constraints]";
    const maxPromptLength = MAX_URL_LENGTH - 500; // Leave room for URL structure
    finalPrompt = prompt.substring(0, maxPromptLength) + truncateWarning;
  }

  const encodedPrompt = encodeURIComponent(finalPrompt);
  let url = `https://lovable.dev/?autosubmit=true#prompt=${encodedPrompt}`;

  // Add images only in Full Mode
  if (mode === 'full' && imageUrls && imageUrls.length > 0) {
    const validUrls = imageUrls.filter(url => url.trim() !== '' && isValidUrl(url));
    validUrls.slice(0, 10).forEach(imageUrl => { // Max 10 images
      url += `&images=${encodeURIComponent(imageUrl)}`;
    });
  }

  return url;
}

/**
 * Validate URL format
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
