import { Fragment } from 'react'

/**
 * Renders the rich text the editor produces (Sanity's Portable Text) as React
 * elements.
 *
 * Nothing here is parsed as HTML. Each span becomes a text node or an <a>, so
 * a stray < or & typed into the editor reaches the page as those characters
 * rather than as markup, and no cell of content can ever inject a tag.
 *
 * Links are honoured only when they are http or https, which is what keeps
 * javascript: and data: out even if someone pasted one into the link field.
 *
 * Bold is rendered with <strong>. The editor deliberately offers no italic:
 * this site's stylesheet renders <em> as bold anyway, so an italic button
 * would be a control that silently does the wrong thing.
 */
export function portableText(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  const out = []
  blocks.forEach((block, bi) => {
    if (!block || block._type !== 'block' || !Array.isArray(block.children)) return
    const defs = Array.isArray(block.markDefs) ? block.markDefs : []

    // A second paragraph in a one-line field is almost always an accidental
    // Enter. Keep it on the page, but as a line break rather than a gap.
    if (out.length) out.push(<br key={`br-${bi}`} />)

    block.children.forEach((child, ci) => {
      const node = renderSpan(child, defs, `${bi}-${ci}`)
      if (node !== null) out.push(node)
    })
  })

  return out.length ? out : null
}

function renderSpan(child, defs, key) {
  if (!child || child._type !== 'span') return null
  const text = String(child.text == null ? '' : child.text)
  if (!text) return null

  const marks = Array.isArray(child.marks) ? child.marks : []
  let node = text
  if (marks.includes('strong') || marks.includes('em')) node = <strong>{node}</strong>

  const linkMark = marks.find(m => defs.some(d => d && d._key === m && d._type === 'link'))
  if (linkMark) {
    const def = defs.find(d => d && d._key === linkMark)
    const href = String((def && def.href) || '').trim()
    if (/^https?:\/\//i.test(href)) {
      return (
        <a key={key} className="tlink" style={{ display: 'inline' }}
          href={href} target="_blank" rel="noopener noreferrer">{node}</a>
      )
    }
  }

  return <Fragment key={key}>{node}</Fragment>
}
