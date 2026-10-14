// Mock initial data for clients, audits, and settings

export const INITIAL_BRAND_SETTINGS = {
  businessName: 'Conversion Vanguard Strategy',
  auditorName: 'Alex Mercer',
  auditorTitle: 'Principal Funnel Strategist',
  website: 'https://conversionvanguard.com',
  email: 'alex@conversionvanguard.com',
  phone: '+1 (555) 382-9104',
  primaryColor: '#4f46e5',
  secondaryColor: '#06b6d4',
  accentColor: '#10b981',
  logoUrl: '',
  methodologyNotes: 'All evaluations adhere to the 5-point Vanguard Conversion Rubric. Scores are computed against quantitative conversion benchmarks across category weights totaling 100%.'
};

export const INITIAL_CLIENTS = [
  {
    id: 'client-1',
    companyName: 'Apex SaaS Labs',
    contactName: 'Marcus Vance',
    email: 'marcus@apexsaas.io',
    website: 'https://apexsaas.io',
    industry: 'Enterprise Software',
    offer: '$12,000/yr AI Automated Workflow Suite',
    targetAudience: 'VPs of Operations and CTOs in mid-market tech companies (50-500 employees)',
    notes: 'Preparing for Series A expansion. Need to elevate landing page conversion rate from 1.8% to 3.5% before scaling paid LinkedIn ad spend.',
    createdAt: '2026-06-15'
  },
  {
    id: 'client-2',
    companyName: 'Nova Health Supplements',
    contactName: 'Elena Rostova',
    email: 'elena@novahealth.co',
    website: 'https://novahealth.co',
    industry: 'Health & Wellness',
    offer: '$79/mo Daily Nootropic Performance Stack',
    targetAudience: 'High-performing tech founders, knowledge workers, and biohackers aged 26-45',
    notes: 'Running Meta and YouTube ads. High opt-in on top of funnel, but experiencing steep drop-off at checkout and upsell stages.',
    createdAt: '2026-07-20'
  },
  {
    id: 'client-3',
    companyName: 'Urban Bloom Studio',
    contactName: 'David Kim',
    email: 'david@urbanbloom.design',
    website: 'https://urbanbloom.design',
    industry: 'Architecture & Commercial Design',
    offer: 'Turnkey $25,000 Commercial Interior Architecture',
    targetAudience: 'Boutique hospitality founders, premium coffeehouse owners, and tech office managers',
    notes: 'Portfolio is visually stunning but site visitors rarely book consultation calls. Need conversion architecture overhaul.',
    createdAt: '2026-08-05'
  },
  {
    id: 'client-4',
    companyName: 'Scale Velocity Media',
    contactName: 'Sarah Jenkins',
    email: 'sarah@scalevelocity.com',
    website: 'https://scalevelocity.com',
    industry: 'Marketing Education & Coaching',
    offer: '8-Week High-Ticket Agency Growth Accelerator ($6,000)',
    targetAudience: 'Boutique marketing agency owners seeking predictable outbound & inbound client acquisition',
    notes: 'High organic trust. Looking to launch automated evergreen sales funnel with automated calendar qualification.',
    createdAt: '2026-09-01'
  }
];

// Helper to pre-populate realistic audit responses
function generateApexResponsesV1() {
  // Version 1 (Baseline audit - Score ~72)
  return {
    'lp-fi-1': { score: 3, observation: 'Offer is mentioned but buried in generic jargon ("Transform your operational paradigm").', recommendation: 'Simplify headline to state exact software outcome within 5 seconds.', priority: 'High' },
    'lp-fi-2': { score: 3, observation: 'Headline lacks tangible metric or quantified outcome.', recommendation: 'Rewrite hero headline focusing on time and cost savings.', priority: 'High' },
    'lp-fi-3': { score: 4, observation: 'Subtitle clearly targets operations leaders.', recommendation: 'Add small badge tag "Built for Mid-Market Tech Ops".', priority: 'Low' },
    'lp-fi-4': { score: 3, observation: 'Visual demo gets cut off on 13" laptop screens.', recommendation: 'Reduce hero padding so CTA and UI preview sit above 750px fold.', priority: 'Medium' },
    'lp-fi-5': { score: 4, observation: 'Visual hierarchy is clear with nice typography.', recommendation: 'Maintain current typographic scale.', priority: 'Low' },
    'lp-fi-6': { score: 4, observation: 'Clean mockups and modern styling.', recommendation: 'Add subtle interactive hover to UI demo.', priority: 'Low' },
    'lp-fi-7': { score: 3, observation: 'CTA button blends with navy background.', recommendation: 'Change CTA color to vibrant cyan or electric violet.', priority: 'High' },
    'lp-fi-8': { score: 4, observation: 'Good whitespace throughout.', recommendation: 'Keep whitespace intact.', priority: 'Low' },

    'lp-mo-1': { score: 3, observation: 'Value prop is too broad, sounds like standard ERP.', recommendation: 'Differentiate with AI autonomous trigger capability.', priority: 'High' },
    'lp-mo-2': { score: 3, observation: 'Too much focus on technical architecture, not enough on operational pain.', recommendation: 'Refactor feature bullets into concrete operational benefits.', priority: 'Medium' },
    'lp-mo-3': { score: 3, observation: 'Problem section exists but is too polite.', recommendation: 'Highlight the 18 hours/week engineering time lost without automation.', priority: 'Medium' },
    'lp-mo-4': { score: 4, observation: 'Future vision is well articulated.', recommendation: 'Include customer quote in desired outcome section.', priority: 'Low' },
    'lp-mo-5': { score: 3, observation: 'Pricing is completely hidden behind "Contact Us".', recommendation: 'Provide starting price tier or "Pricing from $999/mo" benchmark.', priority: 'Medium' },
    'lp-mo-6': { score: 3, observation: 'Claims lack hard verification numbers.', recommendation: 'Add statistics showing 3.2x ROI in 90 days.', priority: 'High' },
    'lp-mo-7': { score: 3, observation: 'Does not explain how Apex differs from Zapier Enterprise.', recommendation: 'Add comparison table directly highlighting Apex autonomous agents.', priority: 'High' },
    'lp-mo-8': { score: 2, observation: 'No FAQ section on the entire page.', recommendation: 'Implement 6-question FAQ addressing security, integration, and onboarding.', priority: 'High' },

    'lp-cs-1': { score: 3, observation: 'CTA says "Request Demo" with 9 form fields.', recommendation: 'Reduce form friction and test "Get Instant 5-Minute Sandbox Access".', priority: 'High' },
    'lp-cs-2': { score: 3, observation: 'CTA only appears twice on entire 4,000px page.', recommendation: 'Implement sticky header CTA and repeat CTA at 3 key milestones.', priority: 'High' },
    'lp-cs-3': { score: 3, observation: 'No CTA after the case study block.', recommendation: 'Place a conversion button right after client quote blocks.', priority: 'Medium' },
    'lp-cs-4': { score: 3, observation: 'Button copy is generic "Submit".', recommendation: 'Change to "Explore The Platform →".', priority: 'Medium' },
    'lp-cs-5': { score: 3, observation: 'No microcopy reassuring the user.', recommendation: 'Add "No credit card • Setup in 10 mins • SOC2 Certified".', priority: 'Medium' },
    'lp-cs-6': { score: 2, observation: 'Form asks for phone number, annual revenue, and postal address.', recommendation: 'Cut form down to Work Email and Name. Qualify on step 2.', priority: 'High' },
    'lp-cs-7': { score: 4, observation: 'Header links removed on landing page.', recommendation: 'Keep minimal header.', priority: 'Low' },
    'lp-cs-8': { score: 3, observation: 'No secondary low-commitment lead magnet.', recommendation: 'Offer downloadable "2026 AI Ops Benchmark Report" for unready visitors.', priority: 'Medium' },

    'lp-tc-1': { score: 3, observation: 'Testimonials lack photos and verified company names.', recommendation: 'Gather headshots and verified logos for all quotes.', priority: 'High' },
    'lp-tc-2': { score: 2, observation: 'No G2 or Capterra review badges.', recommendation: 'Embed G2 4.9/5 star badge and customer review excerpts.', priority: 'High' },
    'lp-tc-3': { score: 3, observation: 'Case study is a PDF link instead of on-page story.', recommendation: 'Build an on-page case summary highlighting 42% cost reduction.', priority: 'Medium' },
    'lp-tc-4': { score: 4, observation: 'Client logo strip is present.', recommendation: 'Increase contrast of client logo strip.', priority: 'Low' },
    'lp-tc-5': { score: 3, observation: 'Proof points are vague.', recommendation: 'Highlight "$4.2M saved across 200+ deployments".', priority: 'Medium' },
    'lp-tc-6': { score: 2, observation: 'No risk-reversal or pilot trial guarantee.', recommendation: 'Offer 30-day proof-of-concept pilot guarantee.', priority: 'High' },
    'lp-tc-7': { score: 4, observation: 'SOC2 Type II and GDPR badges visible in footer.', recommendation: 'Move SOC2 badge closer to the primary form.', priority: 'Low' },
    'lp-tc-8': { score: 4, observation: 'Privacy policy and terms linked.', recommendation: 'Keep legal compliance links.', priority: 'Low' },

    'lp-ps-1': { score: 4, observation: 'Hero structure is solid.', recommendation: 'Fine-tune image scaling.', priority: 'Low' },
    'lp-ps-2': { score: 3, observation: 'Problem section is condensed.', recommendation: 'Expand pain point breakdown into visual cards.', priority: 'Medium' },
    'lp-ps-3': { score: 4, observation: 'Solution section is clear.', recommendation: 'Good presentation.', priority: 'Low' },
    'lp-ps-4': { score: 4, observation: 'Benefit cards are well spaced.', recommendation: 'Add icons to benefit cards.', priority: 'Low' },
    'lp-ps-5': { score: 4, observation: 'Feature walkthrough is clean.', recommendation: 'Keep feature structure.', priority: 'Low' },
    'lp-ps-6': { score: 3, observation: 'Proof is isolated to one section.', recommendation: 'Weave quotes throughout feature sections.', priority: 'Medium' },
    'lp-ps-7': { score: 2, observation: 'Missing pricing or package breakdown.', recommendation: 'Add transparent starter package overview.', priority: 'High' },
    'lp-ps-8': { score: 2, observation: 'No FAQ section on page.', recommendation: 'Add accordion FAQ.', priority: 'High' },
    'lp-ps-9': { score: 3, observation: 'Final CTA banner is small and unnoticeable.', recommendation: 'Build full-width gradient closing banner.', priority: 'Medium' },
    'lp-ps-10': { score: 4, observation: 'Clean minimal footer.', recommendation: 'Keep footer tidy.', priority: 'Low' },

    'lp-ux-1': { score: 4, observation: 'Page scrolls smoothly.', recommendation: 'Keep smooth navigation.', priority: 'Low' },
    'lp-ux-2': { score: 4, observation: 'Good contrast on dark theme.', recommendation: 'Maintain contrast standards.', priority: 'Low' },
    'lp-ux-3': { score: 4, observation: 'Inter font family utilized cleanly.', recommendation: 'Maintain typography rules.', priority: 'Low' },
    'lp-ux-4': { score: 3, observation: 'Padding is cramped on tablet views.', recommendation: 'Increase tablet section padding to 64px.', priority: 'Medium' },
    'lp-ux-5': { score: 4, observation: 'Buttons are accessible.', recommendation: 'Keep button styling.', priority: 'Low' },
    'lp-ux-6': { score: 3, observation: 'Form inputs lack clear focus indicators.', recommendation: 'Add crisp purple focus ring to active form inputs.', priority: 'Low' },
    'lp-ux-7': { score: 3, observation: 'Mobile layout requires scrolling past 4 paragraphs.', recommendation: 'Tighten mobile copy length and add sticky mobile button.', priority: 'High' },
    'lp-ux-8': { score: 4, observation: 'Headers are bold and skimmable.', recommendation: 'Keep headline formatting.', priority: 'Low' },

    'lp-tp-1': { score: 4, observation: 'Responsive grid behaves well.', recommendation: 'Verify on older iPhone SE.', priority: 'Low' },
    'lp-tp-2': { score: 3, observation: 'LCP is 3.4 seconds due to uncompressed PNG screenshot.', recommendation: 'Convert 4MB screenshot to 120KB modern WebP.', priority: 'High' },
    'lp-tp-3': { score: 4, observation: 'All internal links functional.', recommendation: 'Continue monitoring links.', priority: 'Low' },
    'lp-tp-4': { score: 3, observation: 'Large PNG assets detected.', recommendation: 'Compress and resize images.', priority: 'High' },
    'lp-tp-5': { score: 5, observation: 'Valid Cloudflare SSL active.', recommendation: 'SSL is optimal.', priority: 'Low' },
    'lp-tp-6': { score: 4, observation: 'GA4 tag firing.', recommendation: 'Verify conversion events.', priority: 'Low' },
    'lp-tp-7': { score: 3, observation: 'LinkedIn Insight Tag not yet installed.', recommendation: 'Deploy LinkedIn tag for B2B retargeting.', priority: 'Medium' },
    'lp-tp-8': { score: 4, observation: 'Title tag has keyword.', recommendation: 'Maintain title tag.', priority: 'Low' },
    'lp-tp-9': { score: 3, observation: 'Meta description is default CMS snippet.', recommendation: 'Write custom 150-char meta description.', priority: 'Low' },
    'lp-tp-10': { score: 4, observation: 'Favicon is present.', recommendation: 'Favicon is crisp.', priority: 'Low' },

    'lp-fu-1': { score: 2, observation: 'Form redirects to generic white page with plain text.', recommendation: 'Build custom branded Thank-You page with calendar embed.', priority: 'High' },
    'lp-fu-2': { score: 2, observation: 'No Thank-You page exists.', recommendation: 'Create /thank-you with next steps and video walkthrough.', priority: 'High' },
    'lp-fu-3': { score: 3, observation: 'Confirmation email took 14 minutes to arrive.', recommendation: 'Optimize webhook trigger to deliver email in < 30 seconds.', priority: 'High' },
    'lp-fu-4': { score: 1, observation: 'No SMS capabilities integrated.', recommendation: 'Integrate SMS confirmation for demo booking reminders.', priority: 'Medium' },
    'lp-fu-5': { score: 3, observation: 'Sales rep gets an unformatted plain email.', recommendation: 'Format Slack webhook notification with company size and industry.', priority: 'Medium' },
    'lp-fu-6': { score: 3, observation: 'Leads dumped into a spreadsheet rather than HubSpot CRM.', recommendation: 'Build direct HubSpot deal and contact creation automation.', priority: 'High' },
    'lp-fu-7': { score: 2, observation: 'No nurture sequence after initial inquiry.', recommendation: 'Draft 4-part automated email case study nurture.', priority: 'High' },
    'lp-fu-8': { score: 2, observation: 'Form submission does not fire a custom GA4 lead event.', recommendation: 'Configure GTM custom event trigger for LeadConversion.', priority: 'High' }
  };
}

function generateApexResponsesV2() {
  // Version 2 (Follow-up audit after recommendations implemented - Score 87!)
  const base = generateApexResponsesV1();
  const v2 = { ...base };

  // Improved items
  v2['lp-fi-1'] = { score: 5, observation: 'Headline now clearly states: "Cut Enterprise Ops Manual Bottlenecks by 60% with Autonomous AI".', recommendation: 'Maintain clear messaging.', priority: 'Low' };
  v2['lp-fi-2'] = { score: 5, observation: 'Headline outcome is quantifiable and captivating.', recommendation: 'Keep current copy.', priority: 'Low' };
  v2['lp-fi-7'] = { score: 5, observation: 'High-contrast neon cyan CTA stands out immediately.', recommendation: 'Excellent visual contrast.', priority: 'Low' };
  v2['lp-mo-6'] = { score: 5, observation: 'Specific stats bar ($14M+ saved, 3.2x ROI) verified on hero.', recommendation: 'Keep proof stats up to date.', priority: 'Low' };
  v2['lp-mo-7'] = { score: 4, observation: 'Comparison matrix clearly positions Apex vs traditional tools.', recommendation: 'Add 1 more feature row.', priority: 'Low' };
  v2['lp-mo-8'] = { score: 4, observation: '6-item interactive accordion FAQ answers top buyer concerns.', recommendation: 'Add question about API rate limits.', priority: 'Low' };
  v2['lp-cs-1'] = { score: 4, observation: 'Form reduced to 2 fields with instant calendar booking step 2.', recommendation: 'Streamlined flow is performing well.', priority: 'Low' };
  v2['lp-cs-2'] = { score: 5, observation: 'Sticky header CTA and 3 balanced page placements implemented.', recommendation: 'Strong CTA distribution.', priority: 'Low' };
  v2['lp-cs-6'] = { score: 4, observation: 'Friction reduced from 9 fields to 2 essential fields.', recommendation: 'Form completion rate increased.', priority: 'Low' };
  v2['lp-tc-1'] = { score: 5, observation: 'All testimonials feature real client photos, titles, and logos.', recommendation: 'Great credibility.', priority: 'Low' };
  v2['lp-tc-2'] = { score: 4, observation: 'G2 4.9/5 star badge embedded prominently.', recommendation: 'Good third-party proof.', priority: 'Low' };
  v2['lp-tc-6'] = { score: 4, observation: '30-day proof-of-concept pilot guarantee badge added.', recommendation: 'Lowers buyer risk.', priority: 'Low' };
  v2['lp-tp-2'] = { score: 5, observation: 'Images converted to WebP. LCP dropped from 3.4s to 1.1s.', recommendation: 'Optimal loading performance.', priority: 'Low' };
  v2['lp-tp-4'] = { score: 5, observation: 'All assets optimized and compressed.', recommendation: 'Optimal.', priority: 'Low' };
  v2['lp-fu-1'] = { score: 4, observation: 'Custom Thank-You page with interactive Calendly embed installed.', recommendation: 'Smooth post-optin transition.', priority: 'Low' };
  v2['lp-fu-2'] = { score: 4, observation: 'Thank-you page provides immediate video orientation.', recommendation: 'Great user experience.', priority: 'Low' };
  v2['lp-fu-6'] = { score: 4, observation: 'HubSpot native integration active with deal pipeline routing.', recommendation: 'Pipeline hygiene established.', priority: 'Low' };
  v2['lp-fu-8'] = { score: 5, observation: 'GA4 custom Lead event fires cleanly with GTM.', recommendation: 'Accurate attribution.', priority: 'Low' };

  return v2;
}

export const INITIAL_AUDITS = [
  {
    id: 'audit-apex-v2',
    name: 'Apex SaaS Q4 Optimization Audit',
    clientId: 'client-1',
    clientName: 'Apex SaaS Labs',
    auditTypeId: 'landing-page-audit',
    auditTypeName: 'Landing Page Audit',
    websiteUrl: 'https://apexsaas.io',
    industry: 'Enterprise Software',
    offer: '$12k/yr AI Automated Workflow Suite',
    targetAudience: 'VPs of Operations and CTOs in mid-market tech companies',
    auditor: 'Alex Mercer',
    auditDate: '2026-10-10',
    status: 'Completed',
    notes: 'Follow-up audit following implementation of Q2 recommendations. Major gains in Conversion Strategy, UX, and Technical speed.',
    responses: generateApexResponsesV2(),
    createdAt: '2026-10-10T14:30:00.000Z',
    updatedAt: '2026-10-12T10:15:00.000Z'
  },
  {
    id: 'audit-apex-v1',
    name: 'Apex SaaS Q2 Initial Baseline Audit',
    clientId: 'client-1',
    clientName: 'Apex SaaS Labs',
    auditTypeId: 'landing-page-audit',
    auditTypeName: 'Landing Page Audit',
    websiteUrl: 'https://apexsaas.io',
    industry: 'Enterprise Software',
    offer: '$12k/yr AI Automated Workflow Suite',
    targetAudience: 'VPs of Operations and CTOs in mid-market tech companies',
    auditor: 'Alex Mercer',
    auditDate: '2026-06-20',
    status: 'Completed',
    notes: 'Initial comprehensive teardown. Uncovered major form friction, weak headline clarity, and missing post-optin follow-up.',
    responses: generateApexResponsesV1(),
    createdAt: '2026-06-20T09:00:00.000Z',
    updatedAt: '2026-06-22T16:00:00.000Z'
  },
  {
    id: 'audit-nova-v1',
    name: 'Nova Health D2C Funnel Audit',
    clientId: 'client-2',
    clientName: 'Nova Health Supplements',
    auditTypeId: 'sales-funnel-audit',
    auditTypeName: 'Sales Funnel Audit',
    websiteUrl: 'https://novahealth.co/offer',
    industry: 'Health & Wellness',
    offer: '$79/mo Daily Nootropic Performance Stack',
    targetAudience: 'Tech founders & biohackers aged 26-45',
    auditor: 'Alex Mercer',
    auditDate: '2026-10-13',
    status: 'In Progress',
    notes: 'Auditing traffic drop-offs from Meta video ads into order form bump. 34 of 46 criteria evaluated so far.',
    responses: {
      'sf-te-1': { score: 4, observation: 'Meta and TikTok ads deliver qualified interest.', recommendation: 'Maintain ad targeting balance.', priority: 'Low' },
      'sf-te-2': { score: 2, observation: 'Ad promises "Instant mental clarity in 20 mins" but landing page discusses clinical ingredient dosage.', recommendation: 'Ensure ad hook is mirrored directly in the hero headline.', priority: 'High' },
      'sf-te-3': { score: 4, observation: 'Lookalike audiences are performing well.', recommendation: 'Test broader interests next.', priority: 'Low' },
      'sf-te-4': { score: 3, observation: 'Color scheme changes abruptly from green in ad to clinical white on page.', recommendation: 'Incorporate familiar product packaging colors in hero.', priority: 'Medium' },
      'sf-te-5': { score: 4, observation: 'High problem-aware traffic.', recommendation: 'Address specific afternoon brain fog.', priority: 'Low' },
      'sf-lp-1': { score: 3, observation: 'Subscription offer terms are confusing to new buyers.', recommendation: 'Clearly differentiate One-Time Purchase vs Subscribe & Save (25% off).', priority: 'High' },
      'sf-lp-2': { score: 3, observation: 'Headline is clinical rather than benefit-oriented.', recommendation: 'Lead with sustained focus without caffeine jitters.', priority: 'High' },
      'sf-lp-3': { score: 4, observation: 'Sticky CTA button is present.', recommendation: 'Keep sticky button.', priority: 'Low' },
      'sf-lp-4': { score: 3, observation: 'Lacks physician or neuroscientist endorsements.', recommendation: 'Add Medical Advisory Board review badge.', priority: 'High' },
      'sf-lp-5': { score: 2, observation: 'Requires 4 clicks before reaching checkout cart.', recommendation: 'Implement direct 1-page checkout drawer.', priority: 'High' },
      'sf-lp-6': { score: 4, observation: 'Storytelling is engaging.', recommendation: 'Keep founder story.', priority: 'Low' },
      'sf-lc-1': { score: 4, observation: 'Opt-in quiz collects health goals.', recommendation: 'Quiz is engaging.', priority: 'Low' },
      'sf-lc-2': { score: 3, observation: 'Quiz has 11 questions, causing 40% bounce rate on question 6.', recommendation: 'Condense quiz to 5 core questions.', priority: 'High' },
      'sf-lc-3': { score: 4, observation: 'Effectively segments caffeine tolerance.', recommendation: 'Keep tolerance filter.', priority: 'Low' },
      'sf-lc-4': { score: 4, observation: 'Quiz CTA is action-oriented.', recommendation: 'Good button copy.', priority: 'Low' },
      'sf-lc-5': { score: 4, observation: 'Mobile quiz UI is smooth.', recommendation: 'Maintain mobile speed.', priority: 'Low' },
      'sf-lc-6': { score: 3, observation: 'Zip code validation fails on international formats.', recommendation: 'Add country dropdown filter.', priority: 'Medium' },
      'sf-ty-1': { score: 3, observation: 'Thank-you page is basic Shopify standard.', recommendation: 'Customize thank-you with personalized supplement usage guide.', priority: 'Medium' },
      'sf-ty-2': { score: 3, observation: 'Delivery timelines are not specified.', recommendation: 'Display estimated delivery date (e.g. "Arrives Thursday by 3pm").', priority: 'Medium' },
      'sf-ty-3': { score: 4, observation: 'Receipt links to portal.', recommendation: 'Good portal link.', priority: 'Low' },
      'sf-ty-4': { score: 4, observation: 'Instant confirmation email fires.', recommendation: 'Good confirmation.', priority: 'Low' },
      'sf-ty-5': { score: 4, observation: 'Purchase pixel fires properly.', recommendation: 'Keep pixel intact.', priority: 'Low' },
      'sf-sp-1': { score: 3, observation: 'Checkout does not support Apple Pay natively.', recommendation: 'Enable Apple Pay and Shop Pay 1-click checkout.', priority: 'High' },
      'sf-sp-2': { score: 4, observation: 'Sales presentation has great ingredient photos.', recommendation: 'Keep ingredient breakdowns.', priority: 'Low' },
      'sf-sp-3': { score: 2, observation: 'Checkout page has distracting header links.', recommendation: 'Remove header navigation on checkout to prevent bounce.', priority: 'High' },
      'sf-sp-4': { score: 2, observation: 'No 1-click order bump on checkout.', recommendation: 'Add a $24 sleep optimization formula order bump on checkout.', priority: 'High' },
      'sf-sp-5': { score: 3, observation: 'Fulfillment notification takes 24 hours.', recommendation: 'Send immediate packing status update.', priority: 'Low' },
      'sf-sp-6': { score: 4, observation: 'Order notifications active.', recommendation: 'Good notification flow.', priority: 'Low' },
      'sf-fn-1': { score: 4, observation: 'Order receipt sent immediately.', recommendation: 'Receipt is clear.', priority: 'Low' },
      'sf-fn-2': { score: 2, observation: 'No customer onboarding email sequence explaining how to take the stack.', recommendation: 'Deploy 5-day educational onboarding sequence on best usage habits.', priority: 'High' },
      'sf-fn-3': { score: 1, observation: 'No SMS shipping or delivery notifications.', recommendation: 'Integrate Postscript or Klaviyo SMS shipping updates.', priority: 'High' },
      'sf-fn-4': { score: 3, observation: 'Subscription renewal notification is cold.', recommendation: 'Send reminder with option to pause or swap flavor.', priority: 'Medium' },
      'sf-fn-5': { score: 2, observation: 'Abandoned cart email offers no incentive or objection handling.', recommendation: 'Send 3-part abandoned cart flow answering top 3 FAQs with 10% coupon.', priority: 'High' },
      'sf-fn-6': { score: 3, observation: 'Retargeting only shows static product photo.', recommendation: 'Run video testimonial ads to abandoned visitors.', priority: 'Medium' }
    },
    createdAt: '2026-10-13T11:00:00.000Z',
    updatedAt: '2026-10-14T08:30:00.000Z'
  },
  {
    id: 'audit-urban-v1',
    name: 'Urban Bloom Commercial Conversion Audit',
    clientId: 'client-3',
    clientName: 'Urban Bloom Studio',
    auditTypeId: 'website-conversion-audit',
    auditTypeName: 'Website Conversion Audit',
    websiteUrl: 'https://urbanbloom.design',
    industry: 'Architecture & Design',
    offer: 'Turnkey $25,000 Commercial Interior Architecture',
    targetAudience: 'Boutique hospitality founders & tech office managers',
    auditor: 'Alex Mercer',
    auditDate: '2026-10-14',
    status: 'Draft',
    notes: 'Draft setup initiated for client review kickoff call scheduled for Friday.',
    responses: {},
    createdAt: '2026-10-14T09:00:00.000Z',
    updatedAt: '2026-10-14T09:00:00.000Z'
  }
];
