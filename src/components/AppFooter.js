import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  function setDateNow() {
    let dateN = new Date()
    return dateN.format("YYYY")
  }
  return (
    <CFooter className="px-4">
      <div>
        <a rel="noopener noreferrer">
            WS
        </a>
        <span className="ms-1">{setDateNow}</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a rel="noopener noreferrer">
         Yellow Sistemas
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
