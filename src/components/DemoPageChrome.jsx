import { Menu, Instagram, Linkedin, Globe } from 'lucide-react'
import { siteConfig } from '../siteConfig.js'

// Standalone-demo page chrome. Wraps the booking widget with a top nav, an
// editorial intro, and a footer for the demo URL. The widget itself is
// untouched and stays iframe-embeddable (App.jsx renders the widget without
// this chrome when the page is opened with ?embed=1).
//
// Nav links and the mobile hamburger are intentionally non-functional in this
// iteration — chrome is presentation only.

const NAV_LINKS = ['About', 'Procedures', 'Contact']

function PageWidth({ children, className = '' }) {
  return <div className={'mx-auto w-full max-w-[640px] px-5 sm:px-6 ' + className}>{children}</div>
}

export default function DemoPageChrome({ children }) {
  const year = new Date().getFullYear()

  return (
    <div className="min-h-dvh bg-cream text-ink flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-navy/10 bg-cream/85 supports-[backdrop-filter]:backdrop-blur-md">
        <PageWidth className="!max-w-[1120px] flex items-center justify-between py-3.5">
          <span className="font-display font-semibold text-[20px] sm:text-[22px] leading-none text-navy">
            {siteConfig.practitionerName}
          </span>
          {/* Desktop: links + phone */}
          <nav className="hidden sm:flex items-center gap-7" aria-label="Primary">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[12.5px] font-medium tracking-[0.02em] text-navy/65 hover:text-navy transition-colors duration-150"
              >
                {label}
              </a>
            ))}
            <a
              href={`tel:${siteConfig.practicePhone}`}
              className="text-[12.5px] font-semibold tracking-[0.02em] text-navy hover:text-navy-600 transition-colors duration-150"
            >
              {siteConfig.practicePhone}
            </a>
          </nav>
          {/* Mobile: hamburger glyph (non-functional) */}
          <button
            type="button"
            className="sm:hidden p-1.5 -mr-1.5 text-navy/65"
            aria-label="Menu"
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </PageWidth>
      </header>

      {/* Environmental banner (only when siteConfig.bannerImageUrl is set) */}
      {siteConfig.bannerImageUrl && (
        <PageWidth className="!max-w-[1120px] pt-4 sm:pt-6">
          <img
            src={siteConfig.bannerImageUrl}
            alt="Practice interior"
            className="w-full h-48 sm:h-72 object-cover rounded-xl shadow-card"
          />
        </PageWidth>
      )}

      {/* Intro */}
      <PageWidth className="pt-12 sm:pt-16 pb-8 sm:pb-10 text-center">
        <h1 className="font-display font-semibold text-[34px] sm:text-[42px] leading-[1.08] text-navy">
          Begin a Conversation
        </h1>
        <p className="mt-3.5 mx-auto max-w-[480px] text-[14px] sm:text-[15px] text-navy/60 leading-relaxed">
          {siteConfig.practitionerName} accepts a limited number of new patients each month.
          Inquiries are reviewed within 24 hours.
        </p>
      </PageWidth>

      {/* Widget */}
      <div className="flex justify-center px-4 pb-14 sm:pb-20">{children}</div>

      {/* Footer */}
      <footer className="mt-auto border-t border-navy/10 bg-cream">
        <PageWidth className="!max-w-[1120px] py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 text-center sm:text-left">
            <div>
              <div className="font-display font-semibold text-[18px] text-navy">
                {siteConfig.practitionerName}
              </div>
              <div className="mt-1.5 text-[12px] text-navy/55 leading-relaxed">
                {siteConfig.practiceAddress}
              </div>
              <a
                href={`tel:${siteConfig.practicePhone}`}
                className="mt-0.5 inline-block text-[12px] text-navy/55 hover:text-navy transition-colors duration-150"
              >
                {siteConfig.practicePhone}
              </a>
            </div>
            <div className="flex items-center justify-center gap-3 text-navy/45">
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram" className="p-2 rounded-lg hover:text-navy hover:bg-navy/[0.05] transition-colors duration-150">
                <Instagram size={17} aria-hidden="true" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn" className="p-2 rounded-lg hover:text-navy hover:bg-navy/[0.05] transition-colors duration-150">
                <Linkedin size={17} aria-hidden="true" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Website" className="p-2 rounded-lg hover:text-navy hover:bg-navy/[0.05] transition-colors duration-150">
                <Globe size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-7 pt-5 border-t border-navy/8 text-[10px] uppercase tracking-[0.14em] text-navy/40 text-center sm:text-left">
            © {year} {siteConfig.practitionerName} · Powered by RIVR
          </div>
        </PageWidth>
      </footer>
    </div>
  )
}
