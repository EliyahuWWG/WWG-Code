import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Book3D from '../src/components/Book3D'
import ParallaxImage from '../src/components/ParallaxImage'
import Nav from '../src/components/Nav'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Book3D', () => {
  it('renders the static cover, which is what prerenders and gets indexed', () => {
    render(<Book3D />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/book-cover.jpg')
    expect(img).toHaveAccessibleName(/Working With God/i)
    // Explicit dimensions are what stop the 3D takeover shifting layout.
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
  })

  it('does not go live under prefers-reduced-motion', () => {
    globalThis.matchMedia = (q) => ({ matches: q.includes('reduce'), addEventListener(){}, removeEventListener(){} })
    const { container } = render(<Book3D />)
    expect(container.querySelector('.book3d')).not.toHaveClass('is-live')
    expect(container.querySelector('canvas')).toBeNull()
  })
})

describe('ParallaxImage', () => {
  it('leaves the image untouched under prefers-reduced-motion', () => {
    globalThis.matchMedia = (q) => ({ matches: q.includes('reduce'), addEventListener(){}, removeEventListener(){} })
    const { container } = render(
      <ParallaxImage className="portrait"><img src="/eliyahu.jpg" alt="test" /></ParallaxImage>
    )
    expect(container.querySelector('.portrait')).not.toHaveClass('is-parallax')
    expect(container.querySelector('img').style.transform).toBe('')
  })
})

describe('Nav', () => {
  it('shows exactly the four tabs the client asked for', () => {
    globalThis.matchMedia = (q) => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){} })
    wrap(<Nav />)
    const primary = screen.getByRole('navigation', { name: /primary/i })
    const labels = [...primary.querySelectorAll('a')].map(a => a.textContent)
    expect(labels).toEqual(['Services', 'Events', 'The Book', 'About'])
  })
})
