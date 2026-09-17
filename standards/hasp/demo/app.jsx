import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { KeyModal } from '../dist/react.js'

function Demo() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ minHeight: '100vh', padding: '3rem 1.5rem', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 .4rem', fontSize: 28 }}>Research Assistant</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 1.2rem', lineHeight: 1.6 }}>
          Runs on your own model key. The key stays in your browser and never touches a server.
        </p>
        <button onClick={() => setOpen(true)}
          style={{ padding: '.5rem 1rem', background: 'var(--color-accent-solid)', color: 'var(--color-text-on-accent)',
            border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Add your key</button>
      </div>
      {open && <KeyModal onClose={() => setOpen(false)} />}
    </div>
  )
}
createRoot(document.getElementById('root')).render(<Demo />)
