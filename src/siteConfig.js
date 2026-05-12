// Centralized per-deployment config. Phase A: brand strings + placeholder
// constants only — just enough to thread brandName and the practice
// placeholders through the existing code. The full config (brand colors,
// logo, pricing visibility, consult fee model, etc.) is wired in Phase D.
export const siteConfig = {
  brandName: 'Atlantic', // placeholder — swapped per-deployment
  practiceName: '[Med Spa Name]',
  practiceAddress: '[Med Spa Address]',
  practicePhone: '[Spa Phone Number]',
  emailSenderName: 'Atlantic Booking', // booking-system identity (notification "from" name)
  emailSenderAddress: 'noreply@rivr.example',
  spaInboxAddress: 'front-desk@medspa.example', // where the spa receives booking notifications
  state: 'FL',
};
