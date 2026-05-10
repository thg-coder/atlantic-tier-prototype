import { useEffect } from 'react'
import { useBooking } from './state/BookingContext.jsx'
import { STEP } from './state/pathUtils.js'

import Banner from './components/Banner.jsx'
import Footer from './components/Footer.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import { BackButton } from './components/Buttons.jsx'

import ServiceSelection from './screens/ServiceSelection.jsx'
import ReturningGate from './screens/ReturningGate.jsx'
import ConsultationFormat from './screens/ConsultationFormat.jsx'
import CalendarStep from './screens/CalendarStep.jsx'
import SameDayOffer from './screens/SameDayOffer.jsx'
import IntakeForm from './screens/IntakeForm.jsx'
import PolicyStep from './screens/PolicyStep.jsx'
import Checkout from './screens/Checkout.jsx'
import Confirmation from './screens/Confirmation.jsx'

const SCREENS = {
  [STEP.SERVICE]: ServiceSelection,
  [STEP.RETURNING_GATE]: ReturningGate,
  [STEP.FORMAT]: ConsultationFormat,
  [STEP.CALENDAR]: CalendarStep,
  [STEP.SAME_DAY]: SameDayOffer,
  [STEP.INTAKE]: IntakeForm,
  [STEP.POLICY]: PolicyStep,
  [STEP.CHECKOUT]: Checkout,
  [STEP.CONFIRMATION]: Confirmation
}

export default function App() {
  const { state, dispatch, goBack, stepIndex, pathSteps } = useBooking()

  // If state mutations leave currentStep outside the active path, snap to last
  // valid step in the path (e.g. user changed isReturningPatient and the
  // Format step disappeared).
  useEffect(() => {
    if (!pathSteps.includes(state.currentStep)) {
      const fallback = pathSteps[pathSteps.length - 1] || STEP.SERVICE
      dispatch({ type: 'GO_TO', step: fallback })
    }
  }, [state.currentStep, pathSteps, dispatch])

  // Scroll the widget content to top on step change for predictable mobile UX.
  useEffect(() => {
    const el = document.getElementById('widget-scroll')
    if (el) el.scrollTop = 0
  }, [state.currentStep])

  const Current = SCREENS[state.currentStep] || ServiceSelection
  const showBack =
    stepIndex > 0 && state.currentStep !== STEP.CONFIRMATION

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
