/** «Blush Bubble» decorations: soft blobs, floating bubbles, twinkling sparkles and the fluttering lash. Visual only. */

/** A soft blob that slowly changes shape (absolute; give it a size and a position). */
export function Blob({ className = "", color = "var(--color-blush-2)", style }: { className?: string; color?: string; style?: React.CSSProperties }) {
  return <span className={`blob pointer-events-none absolute block ${className}`} style={{ background: color, ...style }} aria-hidden />;
}

/** Four-point sparkle. */
export function Sparkle({ size = 18, className = "", color = "currentColor", style }: { size?: number; className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 0c.9 6.4 3.4 9.9 12 12-8.6 2.1-11.1 5.6-12 12-.9-6.4-3.4-9.9-12-12C8.6 9.9 11.1 6.4 12 0z" fill={color} />
    </svg>
  );
}

export function Heart({ size = 22, className = "", color = "var(--color-blush)", style }: { size?: number; className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 21c-5-3.6-9-6.9-9-11.2C3 7 5.1 5 7.7 5c1.8 0 3.3 1 4.3 2.5C13 6 14.5 5 16.3 5 18.9 5 21 7 21 9.8 21 14.1 17 17.4 12 21z" fill={color} />
    </svg>
  );
}

/**
 * A closed eye with lashes that flutter (the shop's own product, drawn). `open` shows it blinking open now and then.
 * Pure SVG + CSS: still for reduced motion.
 */
export function Lash({ width = 120, className = "", color = "var(--color-ink)", open = false }: { width?: number; className?: string; color?: string; open?: boolean }) {
  return (
    <svg width={width} height={width * 0.55} viewBox="0 0 120 66" className={`lash-svg overflow-visible ${open ? "lash-open" : ""} ${className}`} aria-hidden>
      {open && (
        <g className="lash-eye">
          <path d="M10 26c26-24 74-24 100 0-26 24-74 24-100 0z" fill="#fff" />
          <circle cx="60" cy="26" r="13" fill={color} />
          <circle cx="65" cy="21" r="4" fill="#fff" />
          <path d="M10 26c26-24 74-24 100 0" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <g stroke={color} strokeWidth="4" strokeLinecap="round">
            <path d="M28 15l-7-10" />
            <path d="M44 10l-3-11" />
            <path d="M60 8V-3" />
            <path d="M76 10l3-11" />
            <path d="M92 15l7-10" />
          </g>
        </g>
      )}
      <g className="lash-lid">
        <path d="M8 26c28 26 76 26 104 0" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <g className="lash-hairs" stroke={color} strokeWidth="4" strokeLinecap="round">
          <path d="M20 37l-9 13" />
          <path d="M33 44l-5 15" />
          <path d="M47 48l-2 15" />
          <path d="M60 49v15" />
          <path d="M73 48l2 15" />
          <path d="M87 44l5 15" />
          <path d="M100 37l9 13" />
        </g>
      </g>
    </svg>
  );
}

/** Bubbles rising slowly through a section (absolute; the parent needs `relative overflow-hidden`). */
export function Bubbles({ color = "rgb(255 255 255 / 0.55)", dense = false }: { color?: string; dense?: boolean }) {
  const list: [string, number, number, number][] = [
    ["6%", 26, 14, 0],
    ["22%", 14, 11, -4],
    ["48%", 34, 17, -9],
    ["70%", 18, 12, -2],
    ["88%", 24, 15, -7],
    ...(dense
      ? ([
          ["34%", 12, 10, -6],
          ["60%", 22, 13, -11],
          ["95%", 10, 9, -3],
        ] as [string, number, number, number][])
      : []),
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {list.map(([left, size, dur, delay], i) => (
        <span
          key={i}
          className="bubble absolute bottom-[-40px] rounded-full"
          style={{ left, width: size, height: size, background: color, boxShadow: `inset -${size / 6}px -${size / 6}px 0 rgb(255 255 255 / 0.5)`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

/** A few sparkles twinkling in a section's corners. */
export function Sparkles({ colors = ["var(--color-blush)", "var(--color-lilac)", "var(--color-peach)"] }: { colors?: string[] }) {
  const list: [string, string, number, number][] = [
    ["5%", "14%", 22, 0],
    ["91%", "10%", 16, 0.9],
    ["86%", "76%", 26, 1.7],
    ["10%", "80%", 14, 0.5],
    ["50%", "6%", 12, 1.2],
  ];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {list.map(([left, top, size, delay], i) => (
        <span key={i} className="twinkle absolute" style={{ left, top, animationDelay: `${delay}s` }}>
          <Sparkle size={size} color={colors[i % colors.length]} />
        </span>
      ))}
    </div>
  );
}
