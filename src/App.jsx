import { useEffect } from 'react'
import { useBooking } from './state/BookingContext.jsx'
import { STEP, PATH_STEPS } from './state/pathUtils.js'

import Banner from './components/Banner.jsx'
import Footer from './components/Footer.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import { BackButton } from './components/Buttons.jsx'
import DemoPageChrome from './components/DemoPageChrome.jsx'

import Land from './screens/Land.jsx'
import Pick from './screens/Pick.jsx'
import Learn from './screens/Learn.jsx'
import Qualify from './screens/Qualify.jsx'
import Schedule from './screens/Schedule.jsx'
import Confirm from './screens/Confirm.jsx'
import Confirmation from './screens/Confirmation.jsx'

const SCREENS = {
  [STEP.LAND]: Land,
  [STEP.PICK]: Pick,
  [STEP.LEARN]: Learn,
  [STEP.QUALIFY]: Qualify,
  [STEP.SCHEDULE]: Schedule,
  [STEP.CONFIRM]: Confirm,
  [STEP.CONFIRMATION]: Confirmation,
}

// ?embed=1 → render the bare widget (for iframe embeds on real client sites);
// otherwise wrap it in the standalone-demo page chrome.
const IS_EMBED =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('embed')

export default function App() {
  const { state, dispatch, goBack, stepIndex } = useBooking()

  // If a state mutation leaves currentStep outside the flow (and it isn't the
  // terminal screen), snap back to LAND. PATH_STEPS is constant now, so this is
  // really just a safety net for the hydration / hand-edited-state edge case.
  useEffect(() => {
    if (state.currentStep === STEP.CONFIRMATION) return
    if (!PATH_STEPS.includes(state.currentStep)) {
      dispatch({ type: 'GO_TO', step: STEP.LAND })
    }
  }, [state.currentStep, dispatch])

  // Scroll the widget content to top on step change for predictable mobile UX.
  useEffect(() => {
    const el = document.getElementById('widget-scroll')
    if (el) el.scrollTop = 0
  }, [state.currentStep])

  const Current = SCREENS[state.currentStep] || Land
  const showBack = stepIndex > 0 && state.currentStep !== STEP.CONFIRMATION

  const widgetCard = (
    <div
      className={
        'w-full max-w-widget bg-white shadow-widget flex flex-col overflow-hidden ' +
        (IS_EMBED ? 'rounded-none sm:rounded-2xl min-h-screen sm:min-h-0' : 'rounded-2xl')
      }
    >
      <Banner />
      <ProgressBar />
      <main id="widget-scroll" className="flex-1 overflow-y-auto px-6 pt-3 pb-6 flex flex-col">
        {showBack && (
          <div className="mb-4">
            <BackButton onClick={goBack} />
          </div>
        )}
        <Current />
      </main>
      <Footer />
    </div>
  )

  if (IS_EMBED) {
    return (
      <div className="min-h-screen w-full flex justify-center items-start p-0 sm:p-4 bg-transparent">
        {widgetCard}
      </div>
    )
  }

  return <DemoPageChrome>{widgetCard}</DemoPageChrome>
}
