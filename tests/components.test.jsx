import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nav from '../src/components/Nav'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Nav', () => {
  it('shows exactly the four tabs the client asked for', () => {
    globalThis.matchMedia = (q) => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){} })
    wrap(<Nav />)
    const primary = screen.getByRole('navigation', { name: /primary/i })
    const labels = [...primary.querySelectorAll('a')].map(a => a.textContent)
    expect(labels).toEqual(['Services', 'Events', 'The Book', 'About'])
  })
})
