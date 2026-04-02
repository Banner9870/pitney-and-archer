export default function ChicagoStar({ className, style }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <polygon
        points="50,3 60,32.7 90.7,26.5 70,50 90.7,73.5 60,67.3 50,97 40,67.3 9.3,73.5 30,50 9.3,26.5 40,32.7"
        fill="currentColor"
      />
    </svg>
  )
}
