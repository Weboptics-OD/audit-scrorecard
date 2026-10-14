// Default Audit Templates with full category and criteria breakdowns

export const DEFAULT_TEMPLATES = [
  {
    id: 'landing-page-audit',
    name: 'Landing Page Audit',
    description: 'Comprehensive evaluation of offer clarity, conversion strategy, trust elements, mobile UX, and technical performance.',
    icon: 'Layout',
    badge: 'Popular',
    categories: [
      {
        id: 'lp-first-impression',
        name: 'First Impression',
        weight: 15,
        description: 'Immediate 5-second clarity, above-the-fold engagement, and visual hierarchy.',
        criteria: [
          {
            id: 'lp-fi-1',
            name: 'Offer clarity',
            description: 'Can a visitor understand what is being offered within 5 seconds?',
            defaultRecommendation: 'Clarify the core offer above the fold by stating precisely what the product or service delivers without vague buzzwords.'
          },
          {
            id: 'lp-fi-2',
            name: 'Headline clarity',
            description: 'Headline clearly communicates the primary benefit or solution.',
            defaultRecommendation: 'Rewrite the hero headline to clearly state the tangible outcome the client achieves and for whom.'
          },
          {
            id: 'lp-fi-3',
            name: 'Target audience clarity',
            description: 'Is it immediately obvious who this offer is for?',
            defaultRecommendation: 'Add an audience identifier tag or callout (e.g. "For B2B Founders", "For Busy Moms") directly above the headline.'
          },
          {
            id: 'lp-fi-4',
            name: 'Above-the-fold messaging',
            description: 'Key messaging fits neatly above the fold without requiring initial scrolling.',
            defaultRecommendation: 'Streamline the hero section layout so headline, supporting copy, visual asset, and CTA are fully visible above 800px vertical height.'
          },
          {
            id: 'lp-fi-5',
            name: 'Visual hierarchy',
            description: 'Eye is guided naturally through headline, subheadline, visuals, and CTA.',
            defaultRecommendation: 'Establish high visual contrast between primary headlines, body text, and background to guide the visitor’s eye directly to the CTA.'
          },
          {
            id: 'lp-fi-6',
            name: 'Visual credibility',
            description: 'High quality imagery, professional graphics, and brand consistency.',
            defaultRecommendation: 'Replace low-resolution or generic stock photos with authentic product screenshots, video demonstrations, or client imagery.'
          },
          {
            id: 'lp-fi-7',
            name: 'Primary CTA visibility',
            description: 'Call to action button stands out with strong color contrast.',
            defaultRecommendation: 'Use a high-contrast accent color for the primary CTA button that is not used anywhere else on the page.'
          },
          {
            id: 'lp-fi-8',
            name: 'Page clutter',
            description: 'Sufficient whitespace, clean layout, and lack of visual noise.',
            defaultRecommendation: 'Increase whitespace between sections and remove secondary banners or decorative distractions that compete for attention.'
          }
        ]
      },
      {
        id: 'lp-messaging-offer',
        name: 'Messaging & Offer',
        weight: 15,
        description: 'Value proposition, problem-solution alignment, differentiation, and copy strength.',
        criteria: [
          {
            id: 'lp-mo-1',
            name: 'Value proposition',
            description: 'Strong statement of the unique value delivered to the buyer.',
            defaultRecommendation: 'Craft a crisp 2-sentence value proposition communicating unique advantage, target segment, and measurable result.'
          },
          {
            id: 'lp-mo-2',
            name: 'Benefit-driven messaging',
            description: 'Focuses on benefits and outcomes rather than raw features.',
            defaultRecommendation: 'Reframe technical feature bullet points into emotional and operational benefits ("So you can...").'
          },
          {
            id: 'lp-mo-3',
            name: 'Problem identification',
            description: 'Agitates the prospect’s current pain point effectively.',
            defaultRecommendation: 'Introduce a dedicated pain-point agitation section illustrating the frustration, cost, or time lost with current alternatives.'
          },
          {
            id: 'lp-mo-4',
            name: 'Desired outcome',
            description: 'Paints an appealing picture of life after using the product/service.',
            defaultRecommendation: 'Highlight the transformed future state with concrete metrics (e.g. "Save 15 hours/week", "Double qualified pipeline").'
          },
          {
            id: 'lp-mo-5',
            name: 'Offer clarity',
            description: 'Details what is included, pricing, timeline, and delivery.',
            defaultRecommendation: 'List exact deliverables, turnaround times, and pricing terms so prospects have zero ambiguity about what they receive.'
          },
          {
            id: 'lp-mo-6',
            name: 'Specificity',
            description: 'Concrete numbers, timelines, and measurable claims instead of generalizations.',
            defaultRecommendation: 'Replace vague claims like "grow faster" with verified numbers like "increase retention by 34% in 60 days".'
          },
          {
            id: 'lp-mo-7',
            name: 'Differentiation',
            description: 'Explains why the buyer should choose this over competitors.',
            defaultRecommendation: 'Add a comparison matrix or "Why Us vs The Old Way" section highlighting key proprietary advantages.'
          },
          {
            id: 'lp-mo-8',
            name: 'Objection handling',
            description: 'Proactively addresses common doubts, hesitations, and risk.',
            defaultRecommendation: 'Include an FAQ section directly answering the top 5 sales objections (pricing, onboarding speed, guarantee, integration).'
          }
        ]
      },
      {
        id: 'lp-conversion-strategy',
        name: 'Conversion Strategy',
        weight: 15,
        description: 'CTA placement, friction reduction, conversion pathways, and lead capture.',
        criteria: [
          {
            id: 'lp-cs-1',
            name: 'Primary CTA',
            description: 'Clear, singular objective for the page.',
            defaultRecommendation: 'Strengthen the primary CTA by making the desired action specific, visually prominent, and consistent throughout the main conversion path.'
          },
          {
            id: 'lp-cs-2',
            name: 'CTA visibility',
            description: 'CTA is instantly noticeable and repeated at logical decision points.',
            defaultRecommendation: 'Implement a sticky navigation header with the primary CTA button or repeat the CTA at least 3 times along the scroll.'
          },
          {
            id: 'lp-cs-3',
            name: 'CTA placement',
            description: 'Positioned above fold, mid-page, after social proof, and at bottom.',
            defaultRecommendation: 'Position conversion buttons immediately following high-trust sections (case studies and pricing tables).'
          },
          {
            id: 'lp-cs-4',
            name: 'CTA copy',
            description: 'Action-oriented and benefit-focused (e.g. "Claim Your Free Audit").',
            defaultRecommendation: 'Change passive button copy like "Submit" or "Learn More" to active first-person copy like "Get My Free Strategy Call".'
          },
          {
            id: 'lp-cs-5',
            name: 'Conversion path',
            description: 'Step-by-step clarity of what happens next after clicking.',
            defaultRecommendation: 'Add microcopy below the button stating "Takes 2 minutes • No credit card required • Instant access".'
          },
          {
            id: 'lp-cs-6',
            name: 'Form friction',
            description: 'Minimal fields requested to maximize initial submission rates.',
            defaultRecommendation: 'Reduce the form to 2-3 essential fields (Name, Work Email) and capture secondary qualification details on step 2.'
          },
          {
            id: 'lp-cs-7',
            name: 'Competing actions',
            description: 'No outbound links, header navigation links, or secondary distractions.',
            defaultRecommendation: 'Remove header links, social icons, and unnecessary external links that bleed traffic away from the conversion goal.'
          },
          {
            id: 'lp-cs-8',
            name: 'Lead capture strategy',
            description: 'Compelling lead magnet, demo, trial, or consultation hook.',
            defaultRecommendation: 'Offer a high-perceived-value lead incentive or risk-reversal guarantee to lower initial commitment friction.'
          }
        ]
      },
      {
        id: 'lp-trust-credibility',
        name: 'Trust & Credibility',
        weight: 15,
        description: 'Social proof, reviews, case studies, risk-reversal, and business badges.',
        criteria: [
          {
            id: 'lp-tc-1',
            name: 'Testimonials',
            description: 'Quotes with full client names, titles, companies, and headshots.',
            defaultRecommendation: 'Enrich testimonials with client photo, full name, role, and verified company logo for authentic social proof.'
          },
          {
            id: 'lp-tc-2',
            name: 'Reviews',
            description: 'Third-party review ratings (Trustpilot, Google, G2, Capterra).',
            defaultRecommendation: 'Embed third-party review widgets or verified aggregate star ratings (e.g. "4.9/5 from 350+ reviews").'
          },
          {
            id: 'lp-tc-3',
            name: 'Case studies',
            description: 'In-depth stories showing before, implementation, and after results.',
            defaultRecommendation: 'Include mini case study cards showcasing specific metric transformations (e.g. "How Company X increased MRR by 42%").'
          },
          {
            id: 'lp-tc-4',
            name: 'Client logos',
            description: 'Recognizable brand logos displayed prominently.',
            defaultRecommendation: 'Add a "Trusted by over 500+ modern teams" logo ticker right underneath the hero section.'
          },
          {
            id: 'lp-tc-5',
            name: 'Results/proof',
            description: 'Hard statistics, revenue generated, hours saved, or volume handled.',
            defaultRecommendation: 'Create a stats counter bar highlighting cumulative results (e.g. "$12M+ generated", "99.8% customer satisfaction").'
          },
          {
            id: 'lp-tc-6',
            name: 'Guarantee',
            description: 'Clear risk-reversal (e.g. 30-day money-back guarantee, SLA).',
            defaultRecommendation: 'State an unconditional 30-day satisfaction guarantee badge next to the pricing or checkout action.'
          },
          {
            id: 'lp-tc-7',
            name: 'Credentials',
            description: 'Industry awards, security certifications (SOC2, GDPR), press mentions.',
            defaultRecommendation: 'Showcase security compliance badges (SOC2 Type II, ISO 27001, HIPAA) or industry certification badges.'
          },
          {
            id: 'lp-tc-8',
            name: 'Business information',
            description: 'Physical address, contact phone/email, privacy policy, and terms.',
            defaultRecommendation: 'Ensure company legal entity name, support contact, and links to Privacy Policy & Terms are in the footer.'
          }
        ]
      },
      {
        id: 'lp-page-structure',
        name: 'Page Structure',
        weight: 10,
        description: 'Logical narrative flow, modular sections, and smooth progression.',
        criteria: [
          {
            id: 'lp-ps-1',
            name: 'Hero section',
            description: 'Balanced hero structure with headline, subcopy, CTA, and visual.',
            defaultRecommendation: 'Align the hero into a two-column desktop grid with copy on left and high-impact visual demo on right.'
          },
          {
            id: 'lp-ps-2',
            name: 'Problem section',
            description: 'Section highlighting current bottlenecks and customer struggles.',
            defaultRecommendation: 'Add a "Tired of X?" section breaking down the 3 biggest pain points prospects currently face.'
          },
          {
            id: 'lp-ps-3',
            name: 'Solution section',
            description: 'Introduction of how the solution uniquely resolves pain points.',
            defaultRecommendation: 'Position the product/service as the modern mechanism that bridges the gap between problem and goal.'
          },
          {
            id: 'lp-ps-4',
            name: 'Benefits',
            description: 'Clear 3-4 column benefit callouts with icons and concise copy.',
            defaultRecommendation: 'Structure benefits into 3 bite-sized cards with bold benefit headers and 2 explanatory sentences.'
          },
          {
            id: 'lp-ps-5',
            name: 'Features',
            description: 'Detailed breakdown of core features, toolsets, and specifications.',
            defaultRecommendation: 'Show alternating feature rows with interactive screenshots or UI previews alongside feature details.'
          },
          {
            id: 'lp-ps-6',
            name: 'Social proof',
            description: 'Social proof distributed throughout the page rather than clumped.',
            defaultRecommendation: 'Disperse proof points evenly throughout the page instead of confining them to one single section.'
          },
          {
            id: 'lp-ps-7',
            name: 'Offer section',
            description: 'Dedicated pricing, package options, or offer breakdown table.',
            defaultRecommendation: 'Include a high-clarity pricing tier card with "Most Popular" highlighted and full feature checklist.'
          },
          {
            id: 'lp-ps-8',
            name: 'FAQ',
            description: 'Expandable accordion answering top purchase concerns.',
            defaultRecommendation: 'Implement an interactive accordion FAQ to save vertical space while addressing common pre-purchase doubts.'
          },
          {
            id: 'lp-ps-9',
            name: 'CTA sections',
            description: 'Final high-impact closing CTA banner before footer.',
            defaultRecommendation: 'Build a full-width high-contrast closing callout banner with final risk-reversal guarantee and button.'
          },
          {
            id: 'lp-ps-10',
            name: 'Footer',
            description: 'Clean footer with copyright, links, and minimal clutter.',
            defaultRecommendation: 'Clean up footer navigation to include only mandatory legal links and copyright to prevent leakages.'
          }
        ]
      },
      {
        id: 'lp-ux-usability',
        name: 'UX & Usability',
        weight: 10,
        description: 'Readability, spacing, typography, mobile experience, and scannability.',
        criteria: [
          {
            id: 'lp-ux-1',
            name: 'Navigation',
            description: 'Smooth scrolling, intuitive anchors, or intentionally focused flow.',
            defaultRecommendation: 'Ensure navigation links smoothly scroll to relevant on-page sections or remove navigation entirely for pure landing pages.'
          },
          {
            id: 'lp-ux-2',
            name: 'Readability',
            description: 'High contrast text against background, comfortable line height.',
            defaultRecommendation: 'Increase body text line-height to 1.6 and ensure text contrast meets WCAG AA standards (4.5:1 ratio).'
          },
          {
            id: 'lp-ux-3',
            name: 'Typography',
            description: 'Consistent font pairings, appropriate sizes, and clear hierarchy.',
            defaultRecommendation: 'Limit typography to 2 font families (one for headings, one for body) and maintain consistent rem font scale.'
          },
          {
            id: 'lp-ux-4',
            name: 'Spacing',
            description: 'Generous padding and margin between sections and content blocks.',
            defaultRecommendation: 'Standardize vertical section padding to 80px-100px on desktop and 48px-64px on mobile.'
          },
          {
            id: 'lp-ux-5',
            name: 'Button usability',
            description: 'Generous click targets, clear hover states, accessible feedback.',
            defaultRecommendation: 'Ensure all buttons have minimum touch target of 48px height, subtle hover elevation, and active feedback states.'
          },
          {
            id: 'lp-ux-6',
            name: 'Form usability',
            description: 'Clear labels, placeholder hints, inline validation, mobile keyboard types.',
            defaultRecommendation: 'Add explicit floating or top labels and use proper HTML input types (email, tel) for easy mobile autofill.'
          },
          {
            id: 'lp-ux-7',
            name: 'Mobile experience',
            description: 'Effortless tap targets, thumb-friendly CTAs, and responsive stacking.',
            defaultRecommendation: 'Implement a sticky bottom mobile CTA bar that stays fixed as the user scrolls through the page.'
          },
          {
            id: 'lp-ux-8',
            name: 'Scannability',
            description: 'Use of bold text, bullet points, and highlighted keywords for quick skimming.',
            defaultRecommendation: 'Break long paragraphs into 2-3 line digestible chunks and use bolding on key benefit takeaways.'
          }
        ]
      },
      {
        id: 'lp-technical-performance',
        name: 'Technical & Performance',
        weight: 10,
        description: 'Speed, responsiveness, asset optimization, security, and tracking setup.',
        criteria: [
          {
            id: 'lp-tp-1',
            name: 'Mobile responsiveness',
            description: 'No horizontal overflow, misaligned text, or broken grids on phones.',
            defaultRecommendation: 'Fix viewport overflow issues and inspect horizontal layout breaks on 375px-414px mobile widths.'
          },
          {
            id: 'lp-tp-2',
            name: 'Page speed',
            description: 'Fast LCP under 2.5s and instant visual rendering.',
            defaultRecommendation: 'Optimize Largest Contentful Paint (LCP) by preloading hero fonts, utilizing modern WebP/AVIF images, and lazy loading below-fold assets.'
          },
          {
            id: 'lp-tp-3',
            name: 'Broken links',
            description: 'All links, anchor tags, and buttons function correctly.',
            defaultRecommendation: 'Audit all links and anchor tags using an automated link checker to eliminate 404 dead ends.'
          },
          {
            id: 'lp-tp-4',
            name: 'Image optimization',
            description: 'Images compressed, served in modern formats, and dimensioned.',
            defaultRecommendation: 'Compress all hero and body assets using modern WebP formats and specify explicit width/height to prevent layout shifts.'
          },
          {
            id: 'lp-tp-5',
            name: 'SSL',
            description: 'Valid HTTPS certificate active across all page resources.',
            defaultRecommendation: 'Ensure automated SSL certificate renewal is configured and all HTTP traffic permanently redirects to HTTPS.'
          },
          {
            id: 'lp-tp-6',
            name: 'Analytics',
            description: 'Google Analytics 4 or privacy-friendly tracking tag installed.',
            defaultRecommendation: 'Verify GA4 tracking snippet is deployed via Google Tag Manager in the document head.'
          },
          {
            id: 'lp-tp-7',
            name: 'Tracking',
            description: 'Meta Pixel, LinkedIn Insight Tag, or TikTok pixel active.',
            defaultRecommendation: 'Install advertising conversion pixels and test standard events (PageView, Lead) with pixel helper extensions.'
          },
          {
            id: 'lp-tp-8',
            name: 'Meta title',
            description: 'Accurate, compelling meta title under 60 characters with keywords.',
            defaultRecommendation: 'Update page <title> tag to include primary value proposition, target keyword, and brand name under 60 chars.'
          },
          {
            id: 'lp-tp-9',
            name: 'Meta description',
            description: 'Click-worthy description under 155 characters for search & social.',
            defaultRecommendation: 'Write an actionable meta description summarizing the core offer with a clear invitation to click.'
          },
          {
            id: 'lp-tp-10',
            name: 'Favicon',
            description: 'Crisp brand favicon visible in browser tab and bookmarks.',
            defaultRecommendation: 'Provide 32x32 and 192x192 PNG/SVG brand favicons for professional browser tab appearance.'
          }
        ]
      },
      {
        id: 'lp-follow-up',
        name: 'Follow-up',
        weight: 15,
        description: 'Post-submission experience, thank-you flow, CRM sync, and nurturing.',
        criteria: [
          {
            id: 'lp-fu-1',
            name: 'Form submission experience',
            description: 'Immediate loading feedback, success state, and confirmation.',
            defaultRecommendation: 'Add an animated spinner on button click and prevent double submissions with button state disabling.'
          },
          {
            id: 'lp-fu-2',
            name: 'Thank-you page',
            description: 'Dedicated thank-you page with explicit next steps and additional value.',
            defaultRecommendation: 'Redirect conversions to a custom Thank-You page that outlines next steps, provides a calendar booking link, or shares bonus resources.'
          },
          {
            id: 'lp-fu-3',
            name: 'Email confirmation',
            description: 'Automated email sent within 60 seconds confirming the request.',
            defaultRecommendation: 'Configure a trigger to dispatch an automated confirmation email immediately with expected response times.'
          },
          {
            id: 'lp-fu-4',
            name: 'SMS follow-up',
            description: 'Instant SMS text message confirmation where phone is collected.',
            defaultRecommendation: 'Set up an automated SMS notification acknowledging receipt and offering instant two-way SMS messaging.'
          },
          {
            id: 'lp-fu-5',
            name: 'Lead notification',
            description: 'Instant internal team notification via Slack, email, or webhook.',
            defaultRecommendation: 'Route new leads into a dedicated internal Slack channel or sales email notification with lead details.'
          },
          {
            id: 'lp-fu-6',
            name: 'CRM integration',
            description: 'Lead data reliably pushed into HubSpot, GoHighLevel, or ActiveCampaign.',
            defaultRecommendation: 'Sync form submissions with CRM via native integration or webhook, mapping all custom fields.'
          },
          {
            id: 'lp-fu-7',
            name: 'Lead nurturing',
            description: 'Multi-day automated drip sequence educating the prospect.',
            defaultRecommendation: 'Build a 5-part automated email welcome sequence that builds authority, showcases case studies, and drives consults.'
          },
          {
            id: 'lp-fu-8',
            name: 'Conversion tracking',
            description: 'Form submission fires GA4 and ad pixel conversion events.',
            defaultRecommendation: 'Verify server-side or thank-you page conversion event tags fire cleanly for GA4 and ad platforms.'
          }
        ]
      }
    ]
  },
  {
    id: 'sales-funnel-audit',
    name: 'Sales Funnel Audit',
    description: 'End-to-end customer journey evaluation from ad traffic to sales conversion, automated nurture sequences, and retention.',
    icon: 'TrendingUp',
    badge: 'High Impact',
    categories: [
      {
        id: 'sf-traffic-entry',
        name: 'Traffic & Entry',
        weight: 10,
        description: 'Traffic acquisition alignment, message matching, audience targeting, and ad-to-page consistency.',
        criteria: [
          {
            id: 'sf-te-1',
            name: 'Traffic source',
            description: 'Clarity on primary traffic channels and suitability for the offer.',
            defaultRecommendation: 'Segment traffic sources and evaluate whether acquisition channel matches prospective buyer purchase intent.'
          },
          {
            id: 'sf-te-2',
            name: 'Message match',
            description: 'Ad copy and creative match the landing page headline and visuals identically.',
            defaultRecommendation: 'Align landing page headline verbatim with the top-performing ad copy to preserve scent trail and reduce bounce.'
          },
          {
            id: 'sf-te-3',
            name: 'Audience targeting',
            description: 'Traffic is qualified and relevant rather than generic.',
            defaultRecommendation: 'Tighten audience demographics, job titles, or lookalike thresholds to reduce unqualified click spend.'
          },
          {
            id: 'sf-te-4',
            name: 'Ad-to-page alignment',
            description: 'Colors, fonts, imagery, and tone flow smoothly from ad to page.',
            defaultRecommendation: 'Use identical imagery and color scheme from ad creative directly in the page hero header.'
          },
          {
            id: 'sf-te-5',
            name: 'Traffic intent',
            description: 'Funnel entry points match cold, warm, or hot visitor awareness.',
            defaultRecommendation: 'Tailor the entry hook to visitor awareness level (problem-aware for cold vs solution-aware for retargeting).'
          }
        ]
      },
      {
        id: 'sf-landing-page',
        name: 'Landing Page',
        weight: 15,
        description: 'Core front-end offer clarity, persuasion structure, and conversion friction.',
        criteria: [
          {
            id: 'sf-lp-1',
            name: 'Offer clarity',
            description: 'Irresistible, well-articulated core offer.',
            defaultRecommendation: 'Reframe the core offer to stack high-value bonuses, proprietary frameworks, and clear delivery timelines.'
          },
          {
            id: 'sf-lp-2',
            name: 'Headline',
            description: 'Captivating hook with clear self-interest appeal.',
            defaultRecommendation: 'A/B test a curiosity-driven or big-promise headline that hooks the reader within 3 seconds.'
          },
          {
            id: 'sf-lp-3',
            name: 'CTA',
            description: 'Frictionless, prominent call to action.',
            defaultRecommendation: 'Ensure primary CTA is prominent, contrasts with page colors, and utilizes benefit-driven wording.'
          },
          {
            id: 'sf-lp-4',
            name: 'Trust',
            description: 'Testimonials, client video proof, and credibility badges.',
            defaultRecommendation: 'Incorporate video testimonials and quantifiable results proof adjacent to the primary conversion point.'
          },
          {
            id: 'sf-lp-5',
            name: 'Conversion friction',
            description: 'Minimal barriers to immediate engagement.',
            defaultRecommendation: 'Eliminate secondary navigation, external links, and optional form questions to minimize drop-off.'
          },
          {
            id: 'sf-lp-6',
            name: 'Page structure',
            description: 'Logical narrative progression from attention to interest, desire, and action.',
            defaultRecommendation: 'Follow the classic Hook-Story-Offer funnel storytelling framework to sustain reader momentum.'
          }
        ]
      },
      {
        id: 'sf-lead-capture',
        name: 'Lead Capture',
        weight: 15,
        description: 'Opt-in mechanism, form qualification, and error handling.',
        criteria: [
          {
            id: 'sf-lc-1',
            name: 'Form strategy',
            description: 'Appropriate multi-step or single-step approach for funnel type.',
            defaultRecommendation: 'Switch to a 2-step multi-step quiz or opt-in form to leverage micro-commitments and boost conversion by 20-30%.'
          },
          {
            id: 'sf-lc-2',
            name: 'Form length',
            description: 'Balance between lead volume and sales qualification depth.',
            defaultRecommendation: 'Keep step 1 to low-friction contact fields, moving qualification dropdowns to step 2.'
          },
          {
            id: 'sf-lc-3',
            name: 'Lead qualification',
            description: 'Strategic questions filtering out non-ideal prospects.',
            defaultRecommendation: 'Add budget or company size filtering questions to automatically route high-tier leads to priority reps.'
          },
          {
            id: 'sf-lc-4',
            name: 'CTA',
            description: 'Compelling action text on submission buttons.',
            defaultRecommendation: 'Use dynamic submit button copy reflecting the exact step (e.g. "Continue to Schedule Call →").'
          },
          {
            id: 'sf-lc-5',
            name: 'Form experience',
            description: 'Mobile keyboard optimization, autocomplete, and smooth field focus.',
            defaultRecommendation: 'Enable browser autofill attributes and configure numeric keypads for phone and zip code fields.'
          },
          {
            id: 'sf-lc-6',
            name: 'Error handling',
            description: 'Clear, helpful inline error messaging on invalid input.',
            defaultRecommendation: 'Display gentle, instant inline validation cues rather than generic error popups.'
          }
        ]
      },
      {
        id: 'sf-thank-you',
        name: 'Thank-You Experience',
        weight: 10,
        description: 'Post-optin bridge page, calendar booking, and orientation messaging.',
        criteria: [
          {
            id: 'sf-ty-1',
            name: 'Thank-you page',
            description: 'Dedicated bridge page acknowledging submission and guiding user.',
            defaultRecommendation: 'Build a personalized thank-you bridge page featuring a short video thanking the user and setting expectations.'
          },
          {
            id: 'sf-ty-2',
            name: 'Next step clarity',
            description: 'Exact instructions on what to check, watch, or do next.',
            defaultRecommendation: 'Number the next 3 steps clearly: 1) Check inbox, 2) Whitelist email, 3) Book your onboarding call.'
          },
          {
            id: 'sf-ty-3',
            name: 'Booking/checkout transition',
            description: 'Seamless bridge into calendar embed or order checkout.',
            defaultRecommendation: 'Embed interactive calendar (Calendly / GHL) directly on the thank-you page with auto-filled contact info.'
          },
          {
            id: 'sf-ty-4',
            name: 'Confirmation messaging',
            description: 'Reassurance that their request has been successfully received.',
            defaultRecommendation: 'Provide clear confirmation text and contact info in case the prospect needs immediate assistance.'
          },
          {
            id: 'sf-ty-5',
            name: 'Tracking',
            description: 'Conversion pixel fires specifically on thank-you load.',
            defaultRecommendation: 'Fire custom Lead or Schedule conversion events only on confirmed thank-you page arrival.'
          }
        ]
      },
      {
        id: 'sf-sales-process',
        name: 'Sales Process',
        weight: 15,
        description: 'Booking flow, checkout optimization, order bumps, upsells, and team handoff.',
        criteria: [
          {
            id: 'sf-sp-1',
            name: 'Booking experience',
            description: 'Fast calendar booking without friction or timezone confusion.',
            defaultRecommendation: 'Use calendar software with automatic local timezone detection and instant calendar invite dispatch (.ics).'
          },
          {
            id: 'sf-sp-2',
            name: 'Sales page',
            description: 'High-converting sales presentation or VSL (Video Sales Letter).',
            defaultRecommendation: 'Enhance sales page with a 7-10 minute structured VSL and synchronized order button appearance.'
          },
          {
            id: 'sf-sp-3',
            name: 'Checkout experience',
            description: '1-page checkout with express payments (Apple Pay, Google Pay).',
            defaultRecommendation: 'Enable express 1-click mobile wallets (Apple Pay, Google Pay) to cut checkout abandonment by up to 25%.'
          },
          {
            id: 'sf-sp-4',
            name: 'Upsell/downsell',
            description: 'One-click post-purchase upsells or order bumps increasing AOV.',
            defaultRecommendation: 'Add a complementary 1-click order bump on the checkout page to instantly increase Average Order Value.'
          },
          {
            id: 'sf-sp-5',
            name: 'Sales handoff',
            description: 'Fast assignment and notification to sales representatives.',
            defaultRecommendation: 'Implement round-robin sales rep routing with automated CRM task assignment.'
          },
          {
            id: 'sf-sp-6',
            name: 'Lead notification',
            description: 'Instant notification to account managers with enriched lead info.',
            defaultRecommendation: 'Set up push notifications via mobile app or Slack webhooks for real-time sales speed-to-lead.'
          }
        ]
      },
      {
        id: 'sf-follow-up-nurture',
        name: 'Follow-up & Nurture',
        weight: 15,
        description: 'Multi-channel email/SMS automation, abandoned recovery, and retargeting.',
        criteria: [
          {
            id: 'sf-fn-1',
            name: 'Email confirmation',
            description: 'Instant transactional confirmation delivering promised asset.',
            defaultRecommendation: 'Ensure email delivery occurs within 30 seconds with immediate asset download link.'
          },
          {
            id: 'sf-fn-2',
            name: 'Email nurture',
            description: '7-14 day value-first email sequence educating and converting.',
            defaultRecommendation: 'Deploy an automated 7-day soap-opera style email sequence handling common friction points.'
          },
          {
            id: 'sf-fn-3',
            name: 'SMS follow-up',
            description: 'Timely SMS touchpoints for high-intent funnel leads.',
            defaultRecommendation: 'Send an automated SMS 15 minutes post-submission offering quick concierge scheduling.'
          },
          {
            id: 'sf-fn-4',
            name: 'Lead reminders',
            description: 'Automated 24h, 1h, and 10min appointment reminders.',
            defaultRecommendation: 'Configure 24-hour and 1-hour email + SMS calendar reminders to achieve 85%+ show-up rates.'
          },
          {
            id: 'sf-fn-5',
            name: 'Abandoned lead recovery',
            description: 'Cart/form abandonment automated recovery sequence.',
            defaultRecommendation: 'Trigger an abandoned cart email sequence 1 hour after drop-off offering assistance or a limited-time bonus.'
          },
          {
            id: 'sf-fn-6',
            name: 'Retargeting',
            description: 'Active ad retargeting campaigns for visited-but-unconverted prospects.',
            defaultRecommendation: 'Create retargeting ad campaigns showing client case studies and testimonials to non-buyers over a 14-day window.'
          }
        ]
      },
      {
        id: 'sf-crm-automation',
        name: 'CRM & Automation',
        weight: 10,
        description: 'Pipeline hygiene, automated tagging, lead statuses, and lifecycle triggers.',
        criteria: [
          {
            id: 'sf-ca-1',
            name: 'CRM integration',
            description: 'Reliable, bi-directional sync between funnel and CRM.',
            defaultRecommendation: 'Verify all custom funnel variables map properly into CRM contact records.'
          },
          {
            id: 'sf-ca-2',
            name: 'Pipeline',
            description: 'Clear deal stages representing the buyer journey stages.',
            defaultRecommendation: 'Structure CRM deal stages into distinct phases (New Lead, Qualified, Call Booked, No Show, Won, Lost).'
          },
          {
            id: 'sf-ca-3',
            name: 'Lead tagging',
            description: 'Granular behavioral tags applied based on pages visited and actions.',
            defaultRecommendation: 'Apply specific source and behavioral tags (e.g. "Source-Meta-Ad1", "Visited-Checkout") for segmentation.'
          },
          {
            id: 'sf-ca-4',
            name: 'Lead assignment',
            description: 'Automated rep distribution based on geography or tier.',
            defaultRecommendation: 'Automate lead assignment rules based on territory, deal size, or rep capacity.'
          },
          {
            id: 'sf-ca-5',
            name: 'Automation',
            description: 'Workflows trigger reliably without manual intervention.',
            defaultRecommendation: 'Audit automation branches to prevent leads from receiving overlapping marketing sequences.'
          },
          {
            id: 'sf-ca-6',
            name: 'Notifications',
            description: 'Alerts sent for critical buyer actions (e.g. proposal viewed).',
            defaultRecommendation: 'Enable automated alerts when high-value leads re-visit key funnel pricing or proposal pages.'
          },
          {
            id: 'sf-ca-7',
            name: 'Lead status tracking',
            description: 'Clean recording of won, lost, and disqualified reasons.',
            defaultRecommendation: 'Require sales reps to record closed-lost reasons to inform continuous funnel optimization.'
          }
        ]
      },
      {
        id: 'sf-tracking-optimization',
        name: 'Tracking & Optimization',
        weight: 10,
        description: 'End-to-end attribution, UTM preservation, event tracking, and split testing.',
        criteria: [
          {
            id: 'sf-to-1',
            name: 'Analytics',
            description: 'Clean GA4 funnel exploration report set up.',
            defaultRecommendation: 'Configure a custom GA4 Funnel Exploration measuring drop-off between each funnel step.'
          },
          {
            id: 'sf-to-2',
            name: 'Conversion tracking',
            description: 'CAPI (Conversions API) active for server-side attribution.',
            defaultRecommendation: 'Implement Meta Conversions API (CAPI) alongside browser pixel for resilient server-side attribution.'
          },
          {
            id: 'sf-to-3',
            name: 'Funnel tracking',
            description: 'Step-by-step conversion rate visibility for every page transition.',
            defaultRecommendation: 'Track micro-conversion rates between each step to pinpoint the exact bottleneck in the customer journey.'
          },
          {
            id: 'sf-to-4',
            name: 'UTM tracking',
            description: 'UTM parameters preserved across subdomains and form submissions.',
            defaultRecommendation: 'Store UTM parameters in browser session cookies and pass them into hidden form fields upon submit.'
          },
          {
            id: 'sf-to-5',
            name: 'Event tracking',
            description: 'Custom events fired for video milestones, scroll depth, and clicks.',
            defaultRecommendation: 'Set up custom event triggers for 50%/75% video watch milestones and key CTA clicks.'
          },
          {
            id: 'sf-to-6',
            name: 'A/B testing',
            description: 'Ongoing split testing active on highest-impact funnel pages.',
            defaultRecommendation: 'Run continuous A/B tests on the top of funnel headline and primary offer hook using a 50/50 traffic split.'
          }
        ]
      }
    ]
  },
  {
    id: 'website-conversion-audit',
    name: 'Website Conversion Audit',
    description: 'Holistic audit covering positioning, homepage conversion architecture, site hierarchy, UX, trust, technical health, and follow-up.',
    icon: 'Globe',
    badge: 'Comprehensive',
    categories: [
      {
        id: 'wc-positioning',
        name: 'Positioning',
        weight: 15,
        description: 'Brand clarity, target audience definition, core differentiation, and offer viability.',
        criteria: [
          {
            id: 'wc-pos-1',
            name: 'Business clarity',
            description: 'Instant comprehension of what the company does.',
            defaultRecommendation: 'Refine the core positioning tagline to state exactly what you do in plain, simple terms.'
          },
          {
            id: 'wc-pos-2',
            name: 'Target audience',
            description: 'Clear signals indicating the ideal customer profile.',
            defaultRecommendation: 'Clearly identify who your services are tailored for on the homepage header and navigation.'
          },
          {
            id: 'wc-pos-3',
            name: 'Value proposition',
            description: 'Differentiated statement of business value and unique outcome.',
            defaultRecommendation: 'Sharpen the value proposition to focus on client ROI and tangible outcomes rather than generic inputs.'
          },
          {
            id: 'wc-pos-4',
            name: 'Differentiation',
            description: 'Clear reasons why customers should choose this firm over competitors.',
            defaultRecommendation: 'Explicitly state your company’s unique methodology or proprietary framework that competitors cannot match.'
          },
          {
            id: 'wc-pos-5',
            name: 'Offer clarity',
            description: 'Packaging and presentation of products/services.',
            defaultRecommendation: 'Group services into clear tiers or packages with transparent deliverables to simplify client decision making.'
          }
        ]
      },
      {
        id: 'wc-homepage',
        name: 'Homepage',
        weight: 15,
        description: 'Hero clarity, primary conversion paths, service overviews, and proof.',
        criteria: [
          {
            id: 'wc-hp-1',
            name: 'Hero section',
            description: 'Engaging, modern hero with clear messaging and CTA.',
            defaultRecommendation: 'Rebuild hero section with concise headline, high-resolution product/service visual, and dual CTAs.'
          },
          {
            id: 'wc-hp-2',
            name: 'Primary CTA',
            description: 'Prominent, attractive CTA button above the fold.',
            defaultRecommendation: 'Elevate primary CTA prominence using distinct high-contrast button styling.'
          },
          {
            id: 'wc-hp-3',
            name: 'Services/products',
            description: 'Well-structured overview of core commercial offerings.',
            defaultRecommendation: 'Feature a clean 3-card overview of core services with links to deep-dive service pages.'
          },
          {
            id: 'wc-hp-4',
            name: 'Benefits',
            description: 'Customer-focused benefit highlights answering "What’s in it for me?".',
            defaultRecommendation: 'Translate technical capabilities into concrete customer advantages and business outcomes.'
          },
          {
            id: 'wc-hp-5',
            name: 'Social proof',
            description: 'Client logos, testimonial quotes, or rating badges displayed.',
            defaultRecommendation: 'Place high-profile client logos immediately below the hero fold to build immediate authority.'
          },
          {
            id: 'wc-hp-6',
            name: 'Trust',
            description: 'Demonstrated experience, years in business, or case stats.',
            defaultRecommendation: 'Add an experience highlight strip (e.g. "Over 10 years serving 400+ enterprises").'
          },
          {
            id: 'wc-hp-7',
            name: 'Navigation',
            description: 'Streamlined header navigation guiding users to high-intent pages.',
            defaultRecommendation: 'Limit main menu items to 5-6 core high-value pages and add a distinct contact/consult CTA button.'
          },
          {
            id: 'wc-hp-8',
            name: 'Conversion path',
            description: 'Obvious, frictionless path for visitors ready to buy or inquire.',
            defaultRecommendation: 'Ensure high-intent conversion pathways (demo, consultation, contact) are accessible within 1 click.'
          }
        ]
      },
      {
        id: 'wc-site-structure',
        name: 'Site Structure',
        weight: 10,
        description: 'Information architecture, page hierarchy, deep service pages, and footer.',
        criteria: [
          {
            id: 'wc-ss-1',
            name: 'Navigation',
            description: 'Intuitive menus, sticky header, and logical categorisation.',
            defaultRecommendation: 'Implement a sticky or smart-hiding navigation bar that remains easily reachable during long page scrolls.'
          },
          {
            id: 'wc-ss-2',
            name: 'Page hierarchy',
            description: 'Logical URL structure and parent-child page relationships.',
            defaultRecommendation: 'Structure URLs logically (e.g. /services/web-design) with breadcrumbs for search engines and users.'
          },
          {
            id: 'wc-ss-3',
            name: 'Service pages',
            description: 'Individual dedicated pages for each primary service offered.',
            defaultRecommendation: 'Create standalone, conversion-optimized landing pages for every core service with dedicated case studies.'
          },
          {
            id: 'wc-ss-4',
            name: 'Product pages',
            description: 'Rich descriptions, specifications, pricing, and visuals.',
            defaultRecommendation: 'Enhance product pages with rich specs, user reviews, visual demos, and clear purchase options.'
          },
          {
            id: 'wc-ss-5',
            name: 'Contact page',
            description: 'Easy-to-find contact page with multiple communication channels.',
            defaultRecommendation: 'Include direct phone, email, contact form, physical address, and team hours on the contact page.'
          },
          {
            id: 'wc-ss-6',
            name: 'FAQ',
            description: 'Dedicated FAQ page or sections addressing common buyer questions.',
            defaultRecommendation: 'Consolidate top prospective client inquiries into a searchable FAQ section to accelerate sales cycles.'
          },
          {
            id: 'wc-ss-7',
            name: 'Footer',
            description: 'Comprehensive footer with sitemap links, legal, and social.',
            defaultRecommendation: 'Organize footer into neat multi-column directory with legal policies, address, and newsletter sign-up.'
          }
        ]
      },
      {
        id: 'wc-conversion',
        name: 'Conversion',
        weight: 15,
        description: 'Conversion hooks, lead capture mechanisms, scheduling, and friction reduction.',
        criteria: [
          {
            id: 'wc-co-1',
            name: 'CTA strategy',
            description: 'Strategic balance of direct CTAs and transitional CTAs.',
            defaultRecommendation: 'Provide a direct CTA for ready buyers ("Book Consultation") and a transitional CTA ("Download Guide") for researchers.'
          },
          {
            id: 'wc-co-2',
            name: 'Lead capture',
            description: 'Effective lead magnet or newsletter incentive for early-stage visitors.',
            defaultRecommendation: 'Add an actionable checklist or industry benchmark report as a downloadable lead generation asset.'
          },
          {
            id: 'wc-co-3',
            name: 'Forms',
            description: 'Intuitive forms with minimal friction and instant validation.',
            defaultRecommendation: 'Audit form field requirements and eliminate non-essential questions to maximize completion rates.'
          },
          {
            id: 'wc-co-4',
            name: 'Booking',
            description: 'Embedded calendar scheduling option for qualified sales prospects.',
            defaultRecommendation: 'Embed interactive meeting scheduler directly on key conversion pages to eliminate email tag.'
          },
          {
            id: 'wc-co-5',
            name: 'Contact options',
            description: 'Live chat, phone, email, and meeting booking options.',
            defaultRecommendation: 'Add modern live chat or asynchronous messaging widget to capture visitors with quick questions.'
          },
          {
            id: 'wc-co-6',
            name: 'Conversion paths',
            description: 'Clear pathways for different visitor segments and buyer personas.',
            defaultRecommendation: 'Provide clear persona-based entry points on the homepage (e.g. "For Startups" vs "For Enterprises").'
          },
          {
            id: 'wc-co-7',
            name: 'Conversion friction',
            description: 'No unnecessary redirects, complex captchas, or broken forms.',
            defaultRecommendation: 'Replace intrusive image captchas with invisible reCAPTCHA v3 or Cloudflare Turnstile.'
          }
        ]
      },
      {
        id: 'wc-trust',
        name: 'Trust',
        weight: 15,
        description: 'Social proof, reviews, certifications, guarantees, and legal compliance.',
        criteria: [
          {
            id: 'wc-tr-1',
            name: 'Testimonials',
            description: 'Specific, verified client endorsements across all major pages.',
            defaultRecommendation: 'Position contextual testimonials directly adjacent to corresponding service offerings.'
          },
          {
            id: 'wc-tr-2',
            name: 'Reviews',
            description: 'Live third-party review widgets and aggregate ratings.',
            defaultRecommendation: 'Display verified Google or Trustpilot rating widgets in header or footer.'
          },
          {
            id: 'wc-tr-3',
            name: 'Case studies',
            description: 'Robust portfolio or case studies with measurable ROI results.',
            defaultRecommendation: 'Publish in-depth case studies documenting the challenge, the strategy, and quantifiable client results.'
          },
          {
            id: 'wc-tr-4',
            name: 'Client logos',
            description: 'Logos of prominent clients, partners, or media features.',
            defaultRecommendation: 'Display logos of reputable clients or media outlets where your work was featured.'
          },
          {
            id: 'wc-tr-5',
            name: 'Credentials',
            description: 'Industry associations, awards, partner badges, and licenses.',
            defaultRecommendation: 'Highlight official partner badges (e.g. Google Partner, Shopify Plus Partner) in the footer.'
          },
          {
            id: 'wc-tr-6',
            name: 'Guarantees',
            description: 'Service level guarantees, warranties, or satisfaction policies.',
            defaultRecommendation: 'Provide clear reassurance through risk-reversal guarantees or explicit satisfaction milestones.'
          },
          {
            id: 'wc-tr-7',
            name: 'Business information',
            description: 'Clear company ownership, physical location, and contact details.',
            defaultRecommendation: 'Display full company legal entity name, headquarters address, and registration information.'
          }
        ]
      },
      {
        id: 'wc-ux',
        name: 'UX',
        weight: 10,
        description: 'Mobile responsiveness, typography hierarchy, accessibility, and visual rhythm.',
        criteria: [
          {
            id: 'wc-ux-1',
            name: 'Mobile experience',
            description: 'Seamless navigation and readability across all mobile viewports.',
            defaultRecommendation: 'Optimize touch targets, menu drawers, and mobile table layouts for seamless smartphone interaction.'
          },
          {
            id: 'wc-ux-2',
            name: 'Typography',
            description: 'High-contrast, legible typography with balanced font scales.',
            defaultRecommendation: 'Ensure comfortable font sizes (minimum 16px body) and consistent heading scaling across all breakpoints.'
          },
          {
            id: 'wc-ux-3',
            name: 'Readability',
            description: 'Optimal line length (50-75 characters) and paragraph spacing.',
            defaultRecommendation: 'Constrain text containers to maximum 700px width for optimal eye tracking and readability.'
          },
          {
            id: 'wc-ux-4',
            name: 'Spacing',
            description: 'Consistent whitespace creating visual breathing room.',
            defaultRecommendation: 'Apply consistent vertical spacing rhythm across sections using standard CSS design tokens.'
          },
          {
            id: 'wc-ux-5',
            name: 'Navigation',
            description: 'Intuitive breadcrumbs, search functionality, and jump links.',
            defaultRecommendation: 'Include an instant site search feature or clear breadcrumb navigation for multi-page websites.'
          },
          {
            id: 'wc-ux-6',
            name: 'Accessibility',
            description: 'WCAG compliance, alt tags on images, and keyboard navigation.',
            defaultRecommendation: 'Add descriptive alt text to all informative images and ensure all interactive controls have visible focus rings.'
          },
          {
            id: 'wc-ux-7',
            name: 'Scannability',
            description: 'Subheadings, icon lists, and callout boxes enabling easy skimming.',
            defaultRecommendation: 'Use bolding, bulleted benefit lists, and callout quote boxes to support visual skimming.'
          }
        ]
      },
      {
        id: 'wc-technical',
        name: 'Technical',
        weight: 10,
        description: 'Site speed, responsive integrity, SEO basics, and tracking infrastructure.',
        criteria: [
          {
            id: 'wc-te-1',
            name: 'Page speed',
            description: 'Google PageSpeed Insights score 85+ and fast server response.',
            defaultRecommendation: 'Leverage CDN caching, minimize unused JavaScript, and optimize core web vitals for sub-2s loads.'
          },
          {
            id: 'wc-te-2',
            name: 'Mobile responsiveness',
            description: 'Flawless layout across phone, tablet, and widescreen monitors.',
            defaultRecommendation: 'Test and eliminate horizontal scrollbars and overlapping elements across all responsive breakpoints.'
          },
          {
            id: 'wc-te-3',
            name: 'Broken links',
            description: 'Zero broken internal or external hyperlinks.',
            defaultRecommendation: 'Set up an automated broken link monitor to catch and fix 404 links.'
          },
          {
            id: 'wc-te-4',
            name: 'SSL',
            description: 'Valid, secure HTTPS protocol enforced site-wide.',
            defaultRecommendation: 'Enforce HSTS and full HTTPS encryption across all pages, assets, and subdomains.'
          },
          {
            id: 'wc-te-5',
            name: 'Analytics',
            description: 'Configured analytics tracking visits, sessions, and events.',
            defaultRecommendation: 'Verify GA4 data stream is collecting clean session data and enhanced measurement events.'
          },
          {
            id: 'wc-te-6',
            name: 'Tracking',
            description: 'Advertising pixels and event parameters configured properly.',
            defaultRecommendation: 'Audit advertising pixel tracking to ensure primary lead and conversion events trigger reliably.'
          },
          {
            id: 'wc-te-7',
            name: 'SEO fundamentals',
            description: 'XML sitemap, robots.txt, canonical tags, and clean URLs.',
            defaultRecommendation: 'Generate and submit an up-to-date XML sitemap to Google Search Console and verify indexation.'
          },
          {
            id: 'wc-te-8',
            name: 'Meta titles',
            description: 'Descriptive, unique meta titles on all indexable pages.',
            defaultRecommendation: 'Write unique title tags for every page with target primary keyword and company brand.'
          },
          {
            id: 'wc-te-9',
            name: 'Meta descriptions',
            description: 'Compelling snippet summaries encouraging SERP click-through.',
            defaultRecommendation: 'Write enticing meta descriptions for core service pages to increase organic search CTR.'
          }
        ]
      },
      {
        id: 'wc-follow-up',
        name: 'Follow-up',
        weight: 10,
        description: 'Post-inquiry handling, automated receipts, CRM routing, and nurturing.',
        criteria: [
          {
            id: 'wc-fu-1',
            name: 'Form confirmation',
            description: 'Clear on-page acknowledgment and instant next steps.',
            defaultRecommendation: 'Display warm, explicit confirmation message confirming when the team will be in contact.'
          },
          {
            id: 'wc-fu-2',
            name: 'Thank-you pages',
            description: 'Dedicated thank-you pages tracking lead conversion goals.',
            defaultRecommendation: 'Redirect inquiries to a thank-you page offering bonus resources and social channels.'
          },
          {
            id: 'wc-fu-3',
            name: 'Email confirmation',
            description: 'Automated receipt email sent immediately to inquiry sender.',
            defaultRecommendation: 'Send immediate automated confirmation email summarizing the client inquiry and next milestones.'
          },
          {
            id: 'wc-fu-4',
            name: 'Lead notification',
            description: 'Immediate team alert via Slack, email, or CRM notifications.',
            defaultRecommendation: 'Send real-time lead alerts to sales leadership via Slack or SMS to guarantee fast response time.'
          },
          {
            id: 'wc-fu-5',
            name: 'CRM integration',
            description: 'Direct ingestion into CRM system with accurate source tagging.',
            defaultRecommendation: 'Integrate website forms directly with CRM to avoid lost inquiries and manual copy-pasting.'
          },
          {
            id: 'wc-fu-6',
            name: 'Lead nurturing',
            description: 'Automated follow-up sequence maintaining prospect engagement.',
            defaultRecommendation: 'Enroll website inquiries into a 4-week educational email newsletter showcasing case studies and tips.'
          }
        ]
      }
    ]
  }
];
