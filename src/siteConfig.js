// Centralized per-deployment config. Edit this file + upload hero image
// to deploy Atlantic to a new client. No other code changes required.
export const siteConfig = {
  // Brand identity
  brandName: 'Atlantic',
  logoUrl: null,                          // null = render brandName as text in Banner
  primaryColor: '#142133',                // brand gradient start (navy default — matches Tailwind navy.DEFAULT)
  primaryColorDark: '#0b1525',            // brand gradient end (darker shade — matches Tailwind navy.900)

  // Practice identity
  practiceName: '[Med Spa Name]',
  practitionerName: 'Dr. [Practitioner Name]',
  practiceAddress: '[Med Spa Address]',
  practicePhone: '[Spa Phone Number]',
  practiceWebsite: 'https://example.com',
  state: 'FL',                            // affects no UI in Atlantic (no GFE flow), but kept for future-proofing

  // Email identity
  emailSenderName: 'Atlantic Booking',
  emailSenderAddress: 'noreply@rivr.example',
  spaInboxAddress: 'front-desk@medspa.example',

  // Landing screen
  // Hero portrait on LAND. Replaces the gray placeholder when populated.
  // Recommended: 4:3 portrait, 600–1200px wide. null = gray placeholder block.
  heroImageUrl: null,
  signatureProcedures: [                  // shown as pills under hero
    'Facial Rejuvenation',
    'Body Contouring',
    'Non-Surgical Refinement',
  ],
  landingBio:                             // body paragraph below pills (replaces Phase C bracketed placeholder)
    '[Short landing paragraph — who the practitioner is and why patients choose this practice. Real copy comes from the client during onboarding.]',

  // Environmental banner on DemoPageChrome — renders horizontally between the
  // top nav and the "Begin a Conversation" heading. Recommended: wide 21:9-ish,
  // 1600–2400px. null = no banner section rendered (current state).
  bannerImageUrl: null,

  // Procedure card images on PICK. Maps a procedure id (PROCEDURE_DETAILS key,
  // plus the special 'comprehensive' key) to an image URL. Recommended: 4:3 or
  // square, 400–600px. Any procedure NOT listed here renders as a text-only
  // card (no empty image slot, no placeholder).
  procedureCardImages: {
    // botox: 'https://example.com/path.jpg',
    // filler: 'https://example.com/path.jpg',
    // microneedling: 'https://example.com/path.jpg',
    // hydrafacial: 'https://example.com/path.jpg',
    // 'chemical-peel': 'https://example.com/path.jpg',
    // 'laser-hair': 'https://example.com/path.jpg',
    // prp: 'https://example.com/path.jpg',
    // 'iv-therapy': 'https://example.com/path.jpg',
    // comprehensive: 'https://example.com/path.jpg',
  },

  // Credentials (first one shown inline on LAND; full list available for future use)
  credentials: [
    'Board Certified — American Board of Plastic Surgery',
    'Active Member, [Professional Society]',
    '[XX] Years in Practice',
  ],

  // Years-in-practice stat (shown inline on LAND if room allows)
  yearsInPractice: '[XX]',
  consultationCount: '[X,XXX+]',

  // Gallery treatment (used by the LEARN screen): 'gated' | 'public' | 'hidden'
  galleryMode: 'gated',

  // Consultation logistics
  virtualConsultMode: 'both',             // 'in_person_only' | 'virtual_only' | 'both'
  recommendedConsultMode: null,           // 'virtual' | 'in_person' | null (only relevant when virtualConsultMode === 'both')

  // Consultation fee model
  consultFeeModel: 'paid_nonrefundable',  // 'free' | 'paid_credit' | 'paid_nonrefundable'
  consultFeeAmount: 150,                  // dollars; ignored if consultFeeModel === 'free'
  consultFeeCreditWindow: 6,              // months; only used if consultFeeModel === 'paid_credit'

  // Pricing posture
  pricingVisibility: 'hide',              // 'hide' | 'show' | 'starting_at'
  priceRanges: {},                        // { [serviceId]: 'string range' } when pricingVisibility !== 'hide'

  // Pre-consult prep (shown on Confirmation + emailed to patient)
  preConsultChecklist: [
    'Photographs of results that appeal to you, if you have any.',
    'A short list of questions you’d like answered.',
    'Recent medical history or medication list, if relevant to your procedure.',
  ],

  // Cancellation + no-show copy
  cancellationPolicyText:
    'Cancellations made more than 48 hours before your consultation are fully refundable. Cancellations within 48 hours forfeit the consultation fee. Rescheduling without cancellation does not incur a fee.',
  noShowPolicyText:
    'If you do not arrive within 15 minutes of your scheduled consultation time and have not contacted us, the appointment is treated as a no-show and the consultation fee is forfeited.',

  // Per-procedure content (used by the PICK + LEARN screens). Keys match the
  // SERVICES[].id values in mockData.js, plus the 'comprehensive' fallback.
  // Real per-procedure copy comes from the client during onboarding — the
  // bracketed strings below demonstrate the structure without making medical
  // claims. Each entry: { label, descriptionShort, education[3], whatToExpect[3] }.
  procedureDetails: {
    botox: {
      label: 'Botox',
      descriptionShort:
        '[Botox — one-line framing of the practice’s approach, e.g. conservative dosing that keeps natural expression. Real copy at onboarding.]',
      education: [
        '[Botox — paragraph 1: what the treatment addresses and the practitioner’s philosophy on it (which lines are typically treated, the stance on starting low and adjusting). Real copy from the client during onboarding.]',
        '[Botox — paragraph 2: how to decide whether it’s the right step now — candidacy, what it will and won’t do, and how it compares to the alternatives the practice offers.]',
        '[Botox — paragraph 3: planning and follow-up — how the consultation establishes a baseline and what an ongoing maintenance rhythm typically looks like.]',
      ],
      whatToExpect: [
        '[Botox — what the consultation itself covers for this area.]',
        '[Botox — typical timeline from consultation to treatment, if you proceed.]',
        '[Botox — what aftercare and the follow-up review look like.]',
      ],
    },
    filler: {
      label: 'Dermal Filler',
      descriptionShort:
        '[Dermal filler — one-line framing, e.g. structural balance over volume for its own sake. Real copy at onboarding.]',
      education: [
        '[Dermal filler — paragraph 1: the areas the practice treats and the principle behind the approach (restoring structure and proportion rather than chasing volume). Real copy from the client during onboarding.]',
        '[Dermal filler — paragraph 2: candidacy and trade-offs — longevity, reversibility, and how it sits alongside surgical alternatives the practice may recommend instead.]',
        '[Dermal filler — paragraph 3: how a result is planned in stages, and the practice’s stance on reviewing before adding more.]',
      ],
      whatToExpect: [
        '[Dermal filler — what the consultation covers for this area.]',
        '[Dermal filler — typical timeline and how results settle, if you proceed.]',
        '[Dermal filler — aftercare and the review visit.]',
      ],
    },
    microneedling: {
      label: 'Microneedling',
      descriptionShort:
        '[Microneedling — one-line framing, e.g. texture and tone over a course of sessions. Real copy at onboarding.]',
      education: [
        '[Microneedling — paragraph 1: what it targets (texture, fine lines, scarring) and the practitioner’s view on realistic gains over a series. Real copy from the client during onboarding.]',
        '[Microneedling — paragraph 2: candidacy, skin-type considerations, and how it’s sequenced with other treatments in the practice’s plans.]',
        '[Microneedling — paragraph 3: the maintenance cadence and how progress is assessed between sessions.]',
      ],
      whatToExpect: [
        '[Microneedling — what the consultation covers.]',
        '[Microneedling — typical course length and spacing of sessions.]',
        '[Microneedling — downtime and aftercare.]',
      ],
    },
    hydrafacial: {
      label: 'HydraFacial',
      descriptionShort:
        '[HydraFacial — one-line framing, e.g. maintenance-tier care, not a substitute for clinical treatment. Real copy at onboarding.]',
      education: [
        '[HydraFacial — paragraph 1: what it does and where it fits in the practice’s spectrum of care — and, candidly, where it doesn’t. Real copy from the client during onboarding.]',
        '[HydraFacial — paragraph 2: who it suits, how often, and how the practice pairs it with longer-term plans.]',
        '[HydraFacial — paragraph 3: setting expectations on results and longevity.]',
      ],
      whatToExpect: [
        '[HydraFacial — what the consultation covers.]',
        '[HydraFacial — what a session involves and how often.]',
        '[HydraFacial — aftercare.]',
      ],
    },
    'chemical-peel': {
      label: 'Chemical Peel',
      descriptionShort:
        '[Chemical peel — one-line framing, e.g. depth matched to your skin and your goal, not a one-size formula. Real copy at onboarding.]',
      education: [
        '[Chemical peel — paragraph 1: what peels address and the practice’s approach to choosing depth and formulation for the individual. Real copy from the client during onboarding.]',
        '[Chemical peel — paragraph 2: candidacy, skin-tone considerations, and how peels are sequenced with other treatments.]',
        '[Chemical peel — paragraph 3: recovery realities and how progress is reviewed.]',
      ],
      whatToExpect: [
        '[Chemical peel — what the consultation covers, including any pre-treatment skin prep.]',
        '[Chemical peel — typical timeline and number of treatments.]',
        '[Chemical peel — downtime and aftercare.]',
      ],
    },
    'laser-hair': {
      label: 'Laser Hair Removal',
      descriptionShort:
        '[Laser hair removal — one-line framing, e.g. device and settings matched to skin and hair type, over a planned course. Real copy at onboarding.]',
      education: [
        '[Laser hair removal — paragraph 1: how it works, the practice’s device choices, and realistic reduction over a series. Real copy from the client during onboarding.]',
        '[Laser hair removal — paragraph 2: candidacy across skin and hair types, and what affects results.]',
        '[Laser hair removal — paragraph 3: the treatment schedule and maintenance over time.]',
      ],
      whatToExpect: [
        '[Laser hair removal — what the consultation and patch testing involve.]',
        '[Laser hair removal — number of sessions and spacing.]',
        '[Laser hair removal — aftercare and sun precautions.]',
      ],
    },
    prp: {
      label: 'PRP / Hair Restoration',
      descriptionShort:
        '[PRP / hair restoration — one-line framing, e.g. an honest read on candidacy before any course is recommended. Real copy at onboarding.]',
      education: [
        '[PRP / hair restoration — paragraph 1: what the treatment is, the evidence the practice relies on, and who tends to respond. Real copy from the client during onboarding.]',
        '[PRP / hair restoration — paragraph 2: candidacy, what it can realistically do, and where the practice would steer you elsewhere instead.]',
        '[PRP / hair restoration — paragraph 3: the treatment course, follow-up imaging, and maintenance.]',
      ],
      whatToExpect: [
        '[PRP / hair restoration — what the consultation and scalp assessment cover.]',
        '[PRP / hair restoration — the schedule of sessions and when results are reviewed.]',
        '[PRP / hair restoration — aftercare.]',
      ],
    },
    'iv-therapy': {
      label: 'IV Therapy',
      descriptionShort:
        '[IV therapy — one-line framing, e.g. a wellness add-on, framed honestly within the practice’s scope. Real copy at onboarding.]',
      education: [
        '[IV therapy — paragraph 1: what the practice offers, the framing it’s comfortable making, and what it won’t claim. Real copy from the client during onboarding.]',
        '[IV therapy — paragraph 2: who it suits and how it’s positioned alongside the rest of the practice’s care.]',
        '[IV therapy — paragraph 3: cadence and what to expect from a session.]',
      ],
      whatToExpect: [
        '[IV therapy — what the consultation covers, including any screening.]',
        '[IV therapy — what a session involves.]',
        '[IV therapy — aftercare.]',
      ],
    },
    comprehensive: {
      label: 'Comprehensive consultation',
      descriptionShort:
        "Multiple concerns or unsure where to begin — we'll discuss your options in depth.",
      education: [
        '[Comprehensive consultation — paragraph 1: the practice’s general consultation approach. How a broad consultation differs from a procedure-specific one, and what gets covered when you’re weighing several directions at once. Real copy from the client during onboarding.]',
        '[Comprehensive consultation — paragraph 2: how the practitioner helps you prioritise — sequencing several goals over time rather than treating everything at once — and what to bring to make that conversation useful.]',
        '[Comprehensive consultation — paragraph 3: what you leave with — a written summary, recommendations, and a suggested sequence — and the practice’s stance on never asking you to decide in the room.]',
      ],
      whatToExpect: [
        '[Comprehensive — a longer, unhurried conversation covering several areas.]',
        '[Comprehensive — an honest read on which goals are realistic, which aren’t, and which to defer.]',
        '[Comprehensive — a written summary with recommendations and a suggested order of priority.]',
      ],
    },
  },
};
