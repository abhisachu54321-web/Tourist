/** Faint map-contour backdrop for dark sections. Decorative only. */
export function Contours({ className = "" }: { className?: string }) {
  const rings = [58, 104, 152, 204, 258, 296];
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 600 600" fill="none" className={className}>
      {rings.map((radius, index) => (
        <ellipse
          key={radius}
          cx={300 + index * 4}
          cy={300 - index * 3}
          rx={radius}
          ry={radius * 0.78}
          transform={`rotate(${-18 + index * 5} 300 300)`}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
