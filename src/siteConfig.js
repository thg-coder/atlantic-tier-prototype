// Centralized per-deployment config. Phases B–C add the fields the 6-stage flow
// needs (practitioner name, hero image, pricing posture, pre-consult checklist,
// per-procedure price ranges). The full config (brand colors, logo, consult-fee
// model, virtual-consult mode, practitioner photo, signature-procedure copy,
// etc.) is wired in Phase D.
export const siteConfig = {
  brandName: 'Atlantic', // placeholder — swapped per-deployment
  practiceName: '[Med Spa Name]',
  practitionerName: 'Dr. [Practitioner Name]',
  practiceAddress: '[Med Spa Address]',
  practicePhone: '[Spa Phone Number]',
  emailSenderName: 'Atlantic Booking', // booking-system identity (notification "from" name)
  emailSenderAddress: 'noreply@rivr.example',
  spaInboxAddress: 'front-desk@medspa.example', // where the spa receives booking notifications
  state: 'FL',

  // Placeholders — real values come from the client during onboarding.
  heroImageUrl: null, // null = render a gray placeholder block on LAND
  pricingVisibility: 'hide', // 'hide' | 'show' | 'starting_at'
  priceRanges: {}, // { [serviceId]: 'string range' } — Phase D wires per-procedure pricing
  preConsultChecklist: [
    'Photographs of results that appeal to you, if you have any.',
    'A short list of questions you’d like answered.',
    'Recent medical history or medication list, if relevant to your procedure.',
  ],
};
