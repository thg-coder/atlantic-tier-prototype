// Centralized per-deployment config. Phase B adds the fields the 6-stage flow
// needs (practitioner name, hero image, pricing posture, pre-consult checklist).
// The full config (brand colors, logo, consult fee model, virtual-consult mode,
// signature-procedure copy, etc.) is wired in Phase D.
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

  // Phase B placeholders — real values come from the client during onboarding.
  heroImageUrl: null, // null = render a gray placeholder block on LAND
  pricingVisibility: 'hide', // 'hide' | 'show' | 'starting_at'
  preConsultChecklist: [
    'Photos of looks you’re drawn to',
    'A list of questions',
    'Recent medical history if you have it handy',
  ],
};
