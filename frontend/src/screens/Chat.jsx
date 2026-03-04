import React from 'react'
import AppNav from '../components/AppNav'

export default function Chat() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppNav />
      <iframe
        src="/physimate-chat.html"
        title="PhysiMate Chat"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  )
}
