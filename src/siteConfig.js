// Centralized per-deployment config. Edit this file + upload hero image
// to deploy Atlantic to a new client. No other code changes required.
export const siteConfig = {
  // Brand identity
  brandName: 'Atlantic',
  logoUrl: null,                          // null = render brandName as text in Banner
  primaryColor: '#1a2942',                // brand gradient start (navy default)
  primaryColorDark: '#0d1729',            // brand gradient end (darker shade)

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
  heroImageUrl: null,                     // null = render gray placeholder block
  signatureProcedures: [                  // shown as pills under hero
    'Facial Rejuvenation',
    'Body Contouring',
    'Non-Surgical Refinement',
  ],
  landingBio:                             // body paragraph below pills (replaces Phase C bracketed placeholder)
    '[Short landing paragraph — who the practitioner is and why patients choose this practice. Real copy comes from the client during onboarding.]',

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
};
