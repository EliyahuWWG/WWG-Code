import { useEffect, useRef } from 'react'

/**
 * Accessible dialog. Uses the native <dialog> element so the browser gives us
 * the top layer, the backdrop and Escape for free, rather than reimplementing
 * a focus trap by hand and getting it subtly wrong.
 *
 * Deliberate choices:
 *  - Clicking the backdrop closes it, because people expect that. The check is
 *    on the event target being the dialog itself: the <dialog> box IS the
 *    backdrop's hit area, and its children are not.
 *  - The page behind is locked from scrolling while open, otherwise the body
 *    scrolls under the dialog on a trackpad.
 */
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-label={title}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
    >
      <div className="modal-panel">
        <button type="button" className="modal-x" onClick={onClose} aria-label="Close">&times;</button>
        {title && <h2 className="h3 modal-title">{title}</h2>}
        {children}
      </div>
    </dialog>
  )
}
