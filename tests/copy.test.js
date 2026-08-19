import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// Guards for the two things the client asked for by name. These are the rules
// most likely to be broken by accident in a later edit, and the least likely
// to be caught by eye.
const SRC = 'src'
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])

const codeFiles = walk(SRC).filter(f => /\.(jsx?|md)$/.test(f))

// Strip JS comments and JSX comment blocks; a note to a developer is not copy.
const stripComments = (s) => s
  .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

describe('client copy rules', () => {
  it('uses no em dashes anywhere in user-facing text', () => {
    const offenders = codeFiles
      .map(f => [f, stripComments(readFileSync(f, 'utf8'))])
      .filter(([, s]) => s.includes('—'))
      .map(([f]) => f)
    expect(offenders, 'em dash found (client asked for none)').toEqual([])
  })

  it('never sets running text in serif italic', () => {
    // .serif-it is redefined as bold; a raw font-style: italic in a component
    // would reintroduce exactly what he objected to.
    const offenders = codeFiles
      .filter(f => f.endsWith('.jsx'))
      .filter(f => /font-style:\s*['"]?italic/.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('does not reintroduce the 30-years CEO coaching overclaim', () => {
    const all = codeFiles.map(f => readFileSync(f, 'utf8')).join('\n')
    expect(all).not.toMatch(/30 years[^.]*coach(ed|ing) CEOs/i)
  })
})
