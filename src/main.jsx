import { ViteReactSSG } from 'vite-react-ssg'
import { initAnalytics } from './analytics'
import { routes } from './App.jsx'
import './index.css'

export const createRoot = ViteReactSSG({ routes, basename: '/' })

// Browser only. The prerender pass runs this file in Node, where there is no
// visitor to measure and no window to attach to.
if (typeof window !== 'undefined') initAnalytics()
