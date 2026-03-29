import{ ClerkProvider }from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </ClerkProvider>

)
