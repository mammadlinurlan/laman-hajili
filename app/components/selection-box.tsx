'use client'

/**
 * Photoshop "Free Transform" selection overlay (mobile only).
 * Wraps any element with a subtle blue transform border + 4 corner handles,
 * giving the continuous live-selection aesthetic as the user scrolls.
 */
export function SelectionBox({
  children,
  className = '',
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {/* Border + handles — mobile only, non-interactive */}
      <div className="md:hidden pointer-events-none absolute inset-0 z-30 border border-blue-400/60">
        <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-500" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-blue-500" />
        <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-blue-500" />
        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-blue-500" />
      </div>
    </div>
  )
}
