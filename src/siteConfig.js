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
  heroImageUrl: '/images/hero.jpg',
  signatureProcedures: [                  // shown as pills under hero
    'Facial Surgery',
    'Body Contouring',
    'Premium Derm',
  ],
  landingBio:                             // body paragraph below pills (replaces Phase C bracketed placeholder)
    '[Short landing paragraph — who the practitioner is and why patients choose this practice. Real copy comes from the client during onboarding.]',

  // Environmental banner on DemoPageChrome — renders horizontally between the
  // top nav and the "Begin a Conversation" heading. Recommended: wide 21:9-ish,
  // 1600–2400px. null = no banner section rendered (current state).
  bannerImageUrl: '/images/banner.jpg',

  // Procedure card images on PICK. Maps a procedure id (PROCEDURE_DETAILS key,
  // plus the special 'comprehensive' key) to an image URL. Recommended: 4:3 or
  // square, 400–600px. Any procedure NOT listed here renders as a text-only
  // card (no empty image slot, no placeholder).
  procedureCardImages: {
    // rhinoplasty: 'https://example.com/path.jpg',
    // facelift: 'https://example.com/path.jpg',
    // 'eyelid-surgery': 'https://example.com/path.jpg',
    // 'breast-augmentation': 'https://example.com/path.jpg',
    // 'body-contouring': 'https://example.com/path.jpg',
    // 'injectable-consultation': 'https://example.com/path.jpg',
    // 'skin-restoration': 'https://example.com/path.jpg',
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
  // Scaffold for onboarding — populate priceRanges (and flip pricingVisibility)
  // only if the practice wants ranges shown. Keep priceRanges as {} until then.
  // priceRanges: {
  //   rhinoplasty: '$8,000–$15,000',
  //   facelift: '$15,000–$30,000',
  //   'eyelid-surgery': '$5,000–$9,000',
  //   'breast-augmentation': '$8,000–$12,000',
  //   'body-contouring': '$10,000–$20,000',
  //   'injectable-consultation': 'consultation fee only',
  //   'skin-restoration': 'varies by case',
  // },

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

  // Render order for the procedure cards on PICK. Every id here must have a
  // matching entry in procedureDetails below. 'comprehensive' is rendered
  // separately below the divider and is intentionally NOT in this list.
  procedureOrder: [
    'rhinoplasty',
    'facelift',
    'eyelid-surgery',
    'breast-augmentation',
    'body-contouring',
    'injectable-consultation',
    'skin-restoration',
  ],

  // Per-procedure content (used by the PICK + LEARN screens). Keys match the
  // SERVICES[].id values in mockData.js, plus the 'comprehensive' fallback.
  // Atlantic = consult-led plastic surgery + premium dermatology, so the copy
  // here is surgical/recovery-oriented. Real per-procedure copy comes from the
  // client during onboarding — the bracketed strings below demonstrate the
  // structure (and the per-procedure mechanism: pick Rhinoplasty vs Facelift and
  // LEARN shows different copy) without making medical claims.
  // Each entry: { label, descriptionShort, education[3], whatToExpect[3] }.
  procedureDetails: {
    rhinoplasty: {
      label: 'Rhinoplasty',
      descriptionShort:
        '[Rhinoplasty — one-line framing of the practice’s approach, e.g. structural rhinoplasty that preserves breathing while refining the aesthetic outcome. Real copy at onboarding.]',
      education: [
        '[Rhinoplasty — paragraph 1: the practice’s philosophy on nasal surgery — structural versus cosmetic-only technique, preservation of breathing function, and where the surgeon sits on the conservatism-versus-transformation spectrum. Real copy from the client during onboarding.]',
        '[Rhinoplasty — paragraph 2: candidacy and decision factors — skeletal maturity, anatomy and skin thickness, prior procedures, ethnic considerations, and primary versus revision cases. What the practice will and won’t take on, and how it assesses fit.]',
        '[Rhinoplasty — paragraph 3: the surgical experience and recovery — open versus closed approach, anesthesia, the splint-and-bruising timeline, the follow-up schedule, and when the result fully settles (often a year or more).]',
      ],
      whatToExpect: [
        '[Rhinoplasty — the consultation covers a functional and aesthetic airway exam, optional digital imaging of possible outcomes, and a frank discussion of the surgical plan and its limits.]',
        '[Rhinoplasty — typical timeline from decision to surgery is roughly 6–12 weeks; plan on about two weeks of social downtime and a splint for the first week.]',
        '[Rhinoplasty — aftercare is a structured follow-up schedule, with results reviewed at roughly 3, 6, and 12 months post-op.]',
      ],
    },
    facelift: {
      label: 'Facelift',
      descriptionShort:
        '[Facelift — one-line framing, e.g. a deep-plane technique that repositions tissue rather than pulling skin, for a result that reads rested rather than done. Real copy at onboarding.]',
      education: [
        '[Facelift — paragraph 1: the practice’s philosophy on lifting the ageing face — which layers are addressed (SMAS / deep plane), why the surgeon favours repositioning over tension, and how the neck and midface are treated as one unit. Real copy from the client during onboarding.]',
        '[Facelift — paragraph 2: candidacy and timing — skin quality, degree of laxity, bone structure, health and smoking status, and when a less invasive option (or simply waiting) is the more honest recommendation.]',
        '[Facelift — paragraph 3: the surgical experience and recovery — anesthesia, drains and dressings, the bruising-and-swelling curve, when patients typically return to work and to social settings, and how long the final result takes to emerge.]',
      ],
      whatToExpect: [
        '[Facelift — the consultation covers a layered assessment of face and neck, a discussion of what a lift can and cannot change, and whether adjunct procedures (eyelids, fat transfer, skin resurfacing) belong in the plan.]',
        '[Facelift — typical timeline from decision to surgery is roughly 8–12 weeks; plan on about two to three weeks before looking presentable in public, and longer before the result is fully refined.]',
        '[Facelift — aftercare includes close early follow-up and a longer review schedule, with results assessed at roughly 6 weeks, 6 months, and 1 year.]',
      ],
    },
    'eyelid-surgery': {
      label: 'Eyelid Surgery',
      descriptionShort:
        '[Eyelid surgery — one-line framing, e.g. conservative blepharoplasty that opens the eye without changing its character. Real copy at onboarding.]',
      education: [
        '[Eyelid surgery — paragraph 1: the practice’s approach to upper and lower blepharoplasty — how much skin and fat is appropriate to remove versus reposition, why preserving fullness matters, and the stance on assessing brow position as part of the picture. Real copy from the client during onboarding.]',
        '[Eyelid surgery — paragraph 2: candidacy and decision factors — distinguishing eyelid skin from a brow descent, dry-eye history, prior LASIK, asymmetry, and when a non-surgical option is the right first step.]',
        '[Eyelid surgery — paragraph 3: the procedure and recovery — local versus general anesthesia, the suture timeline, the bruising-and-swelling window, restrictions on screens and exercise, and when the scars mature.]',
      ],
      whatToExpect: [
        '[Eyelid surgery — the consultation covers an eyelid and brow exam, a tear-film and dry-eye screen, and a discussion of whether upper, lower, or both are indicated.]',
        '[Eyelid surgery — typical timeline from decision to surgery is roughly 4–8 weeks; plan on about 7–10 days of visible bruising and sutures.]',
        '[Eyelid surgery — aftercare includes a suture-removal visit and follow-ups, with results reviewed at roughly 6 weeks and 6 months.]',
      ],
    },
    'breast-augmentation': {
      label: 'Breast Augmentation',
      descriptionShort:
        '[Breast augmentation — one-line framing, e.g. proportion-led implant selection with an honest conversation about long-term maintenance. Real copy at onboarding.]',
      education: [
        '[Breast augmentation — paragraph 1: the practice’s approach to implant type, profile, and placement (over versus under muscle), the role of fat transfer, and why measurements and tissue quality drive the recommendation more than a target size. Real copy from the client during onboarding.]',
        '[Breast augmentation — paragraph 2: candidacy and trade-offs — the reality that implants are devices that may need future surgery, the discussion of risks (capsular contracture, rippling, BIA-ALCL), whether a lift is also needed, and when the practice would recommend against augmentation.]',
        '[Breast augmentation — paragraph 3: the surgical experience and recovery — anesthesia, incision options, the early-recovery timeline, lifting and exercise restrictions, when implants "settle," and the long-term monitoring plan.]',
      ],
      whatToExpect: [
        '[Breast augmentation — the consultation covers chest-wall and tissue measurements, implant sizing (often with sizers or imaging), and a candid discussion of lifetime maintenance.]',
        '[Breast augmentation — typical timeline from decision to surgery is roughly 6–10 weeks; plan on about a week off work and 4–6 weeks before resuming full activity.]',
        '[Breast augmentation — aftercare includes staged follow-ups and a long-term imaging/monitoring schedule appropriate to the implant type.]',
      ],
    },
    'body-contouring': {
      label: 'Body Contouring',
      descriptionShort:
        '[Body contouring — one-line framing, e.g. surgical reshaping after weight loss or pregnancy, planned in stages rather than all at once. Real copy at onboarding.]',
      education: [
        '[Body contouring — paragraph 1: what falls under this heading at the practice — liposuction, abdominoplasty, and post-weight-loss procedures (arms, thighs, body lift) — and the principle of treating skin excess and contour together rather than fat alone. Real copy from the client during onboarding.]',
        '[Body contouring — paragraph 2: candidacy and sequencing — weight stability, nutrition and smoking status, scar trade-offs, the case for staging multiple areas across separate operations, and when the honest answer is "not yet" or "not surgically."]',
        '[Body contouring — paragraph 3: the surgical experience and recovery — anesthesia and operative time, drains and compression garments, the multi-week recovery curve, activity restrictions, and how scars evolve over the first year.]',
      ],
      whatToExpect: [
        '[Body contouring — the consultation covers an assessment of skin laxity and fat distribution by area, a realistic discussion of scars, and a proposed staging plan if more than one area is involved.]',
        '[Body contouring — typical timeline from decision to surgery is roughly 8–12 weeks; the recovery commitment varies by procedure but commonly runs 2–4 weeks before returning to desk work.]',
        '[Body contouring — aftercare includes drain management where applicable, a compression-garment protocol, and follow-ups through the first year.]',
      ],
    },
    'injectable-consultation': {
      label: 'Injectable Consultation',
      descriptionShort:
        '[Injectable consultation — one-line framing, e.g. neuromodulators and fillers dosed conservatively to keep natural movement and proportion. Real copy at onboarding.]',
      education: [
        '[Injectable consultation — paragraph 1: the practice’s philosophy on non-surgical injectables — which areas it treats with neuromodulators versus fillers, the stance on starting low and reviewing, and where it draws the line between refreshing and overfilling. Real copy from the client during onboarding.]',
        '[Injectable consultation — paragraph 2: candidacy and decision factors — what injectables can realistically do, longevity and reversibility, how they sequence alongside (or defer) surgical options, and when the practitioner would recommend a surgical consult instead.]',
        '[Injectable consultation — paragraph 3: planning and follow-up — how the first visit establishes a baseline and a treatment cadence, and what an ongoing maintenance rhythm typically looks like.]',
      ],
      whatToExpect: [
        '[Injectable consultation — the visit covers a facial-movement and proportion assessment, a discussion of which products suit which areas, and a maintenance plan; this consultation can be conducted virtually or in person.]',
        '[Injectable consultation — if you proceed, treatment is often same-visit or scheduled shortly after; results from neuromodulators show over 1–2 weeks and last roughly 3–4 months.]',
        '[Injectable consultation — aftercare is minimal; a follow-up review is scheduled to assess results and refine dosing.]',
      ],
    },
    'skin-restoration': {
      label: 'Skin Restoration & Mohs',
      descriptionShort:
        '[Skin restoration & Mohs — one-line framing, e.g. medical-dermatology rigour for skin cancer and lesions, with reconstruction handled by the surgical team. Real copy at onboarding.]',
      education: [
        '[Skin restoration & Mohs — paragraph 1: what this covers at the practice — skin-cancer evaluation and Mohs surgery, lesion and mole assessment, and the cosmetic-dermatology and resurfacing work that supports scar and skin-quality recovery. Real copy from the client during onboarding.]',
        '[Skin restoration & Mohs — paragraph 2: candidacy and decision factors — how suspicious lesions are worked up and biopsied, when Mohs is the right modality, how reconstruction options are chosen for the location, and the practice’s stance on surveillance for higher-risk patients.]',
        '[Skin restoration & Mohs — paragraph 3: the procedure and recovery — what a Mohs day looks like (staged excision with same-day margin control), the reconstruction and wound-care timeline, scar-maturation expectations, and the resurfacing options available later if wanted.]',
      ],
      whatToExpect: [
        '[Skin restoration & Mohs — the consultation includes a focused skin exam of the area of concern (and a full-body check if indicated), a biopsy if needed, and a discussion of treatment and reconstruction options; an in-person visit is required for lesion assessment.]',
        '[Skin restoration & Mohs — for Mohs cases, surgery is typically scheduled within a few weeks of diagnosis; the procedure is usually a single day, with reconstruction the same day or shortly after.]',
        '[Skin restoration & Mohs — aftercare includes a wound-care protocol, suture removal, scar-review follow-ups, and a recommended skin-surveillance schedule.]',
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
