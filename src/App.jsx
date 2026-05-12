import { useEffect } from 'react'
import { useBooking } from './state/BookingContext.jsx'
import { STEP, PATH_STEPS } from './state/pathUtils.js'

import Banner from './components/Banner.jsx'
import Footer from './components/Footer.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import { BackButton } from './components/Buttons.jsx'

import Land from './screens/Land.jsx'
import Trust from './screens/Trust.jsx'
import Educate from './screens/Educate.jsx'
import Qualify from './screens/Qualify.jsx'
import Schedule from './screens/Schedule.jsx'
import Confirm from './screens/Confirm.jsx'
import Confirmation from './screens/Confirmation.jsx'

const SCREENS = {
  [STEP.LAND]: Land,
  [STEP.TRUST]: Trust,
  [STEP.EDUCATE]: Educate,
  [STEP.QUALIFY]: Qualify,
  [STEP.SCHEDULE]: Schedule,
  [STEP.CONFIRM]: Confirm,
  [STEP.CONFIRMATION]: Confirmation,
}

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

  return (
    <div className="min-h-screen w-full flex justify-center items-start p-0 sm:p-4 bg-transparent">
      <div className="w-full max-w-widget bg-white rounded-none sm:rounded-2xl shadow-widget flex flex-col overflow-hidden min-h-screen sm:min-h-0">
        <Banner />
        <ProgressBar />
        <main
          id="widget-scroll"
          className="flex-1 overflow-y-auto px-5 pt-2 pb-4 flex flex-col"
        >
          {showBack && (
            <div className="mb-3">
              <BackButton onClick={goBack} />
            </div>
          )}
          <Current />
        </main>
        <Footer />
      </div>
    </div>
  )
}
