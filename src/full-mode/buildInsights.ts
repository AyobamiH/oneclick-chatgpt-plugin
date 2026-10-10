/**
 * Build Insights Generator
 * Creates structured developer insights for Full Mode builds
 */

import { BusinessFormData } from './promptBuilder';
import { getPresetById } from './presets';

export interface BuildInsights {
  componentHierarchy: string[];
  seoNotes: string[];
  accessibilityChecklist: string[];
  recommendedSections: string[];
  securityBestPractices: string[];
}

/**
 * Generate structured insights for Full Mode builds
 */
export function generateBuildInsights(data: BusinessFormData): BuildInsights {
  const preset = data.preset ? getPresetById(data.preset) : null;

  const insights: BuildInsights = {
    componentHierarchy: [
      "Header with navigation and logo",
      "Hero section with headline, subheadline, and primary CTA",
      `Services section highlighting ${data.businessType} offerings`,
      "Optional social proof using verified, permissioned testimonials only",
      `About section describing ${data.businessName}'s unique value`,
      "Contact section with form and contact details",
      "Footer with links and legal pages"
    ],

    seoNotes: [
      `Primary keyword: "${data.businessType} in ${data.location}"`,
      `Title tag optimized for local search: "${data.businessName} - ${data.businessType} in ${data.location}"`,
      "Meta description under 160 characters with location and services",
      "JSON-LD appropriate to the business, using only verified name, address and phone supplied by the owner",
      "Semantic HTML5 structure with proper heading hierarchy",
      "Alt text describing each actual image; empty alt for decorative images",
      "Internal linking between service pages and contact",
      "Fast Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1"
    ],

    accessibilityChecklist: [
      "WCAG 2.1 AA color contrast ratios (minimum 4.5:1 for normal text)",
      "All interactive elements keyboard navigable with Tab/Shift+Tab",
      "Visible focus indicators on all focusable elements",
      "ARIA labels for icon-only buttons and navigation",
      "Semantic HTML landmarks (<header>, <main>, <nav>, <footer>)",
      "Alt text for all images and decorative images marked with alt=\"\"",
      "Minimum 48px tap targets for mobile touch interactions",
      "Form inputs properly labeled with <label> elements",
      "Respects prefers-reduced-motion for animations",
      "Skip navigation link for keyboard users"
    ],

    recommendedSections: [
      `Hero: Compelling headline about ${data.primaryGoal}`,
      `Services: Detailed list of ${data.businessType} offerings`,
      "Testimonials: include only genuine reviews supplied with permission; omit if none",
      `About: Story of ${data.businessName} and team credentials`,
      "Contact: Form, phone, email, and address with map",
      "FAQ: Common questions about services and pricing",
      "Gallery: Portfolio of work or facility photos (if applicable)",
      "Call-to-Action: Multiple CTAs throughout for conversions"
    ],

    securityBestPractices: [
      "Form validation on both client and server side",
      "HTTPS enforced for all resources and external links",
      "CSP (Content Security Policy) headers configured",
      "All user inputs sanitized to prevent XSS attacks",
      "Rate limiting on contact form submissions",
      "CORS properly configured for API endpoints",
      "No sensitive data exposed in client-side code",
      "Secure session management if authentication is added"
    ]
  };

  // Add preset-specific insights
  if (preset) {
    insights.componentHierarchy.unshift(`Preset: ${preset.name} - ${preset.description}`);
    insights.seoNotes.push(`Brand personality: ${data.brandVibe} with ${preset.name.toLowerCase()} styling`);
  }

  // Add image-specific insights for Full Mode
  if (data.imageUrls && data.imageUrls.length > 0) {
    insights.recommendedSections.push(`Reference images: ${data.imageUrls.length} image(s) provided for design inspiration`);
  }

  return insights;
}

/**
 * Format insights as readable text for storage
 */
export function formatInsightsAsText(insights: BuildInsights): string {
  let text = "# Build Insights\n\n";

  text += "## Component Hierarchy\n";
  insights.componentHierarchy.forEach(item => {
    text += `- ${item}\n`;
  });

  text += "\n## SEO Notes\n";
  insights.seoNotes.forEach(item => {
    text += `- ${item}\n`;
  });

  text += "\n## Accessibility Checklist\n";
  insights.accessibilityChecklist.forEach(item => {
    text += `${item}\n`;
  });

  text += "\n## Recommended Sections\n";
  insights.recommendedSections.forEach(item => {
    text += `- ${item}\n`;
  });

  text += "\n## Security Best Practices\n";
  insights.securityBestPractices.forEach(item => {
    text += `- ${item}\n`;
  });

  return text;
}

/**
 * Parse insights text back to structured format
 */
export function parseInsightsFromText(text: string): BuildInsights | null {
  if (!text) return null;

  const insights: BuildInsights = {
    componentHierarchy: [],
    seoNotes: [],
    accessibilityChecklist: [],
    recommendedSections: [],
    securityBestPractices: []
  };

  const sections = text.split('\n##');

  sections.forEach(section => {
    const lines = section.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return;

    const title = lines[0].replace('#', '').trim().toLowerCase();
    const items = lines.slice(1).map(line => line.replace(/^[-✓]\s*/, '').trim()).filter(Boolean);

    if (title.includes('component')) insights.componentHierarchy = items;
    else if (title.includes('seo')) insights.seoNotes = items;
    else if (title.includes('accessibility')) insights.accessibilityChecklist = items;
    else if (title.includes('recommended')) insights.recommendedSections = items;
    else if (title.includes('security')) insights.securityBestPractices = items;
  });

  return insights;
}
