const IslamicPattern = ({ className = "", opacity = 0.05 }: { className?: string; opacity?: number }) => (
  <svg
    className={className}
    style={{ opacity }}
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="islamic-stars" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path
          d="M30 0L35.5 12.2L48.5 6.2L42.5 19.2L55 24.7L42.5 30.2L48.5 43.2L35.5 37.2L30 49.5L24.5 37.2L11.5 43.2L17.5 30.2L5 24.7L17.5 19.2L11.5 6.2L24.5 12.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle cx="30" cy="24.7" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-stars)" />
  </svg>
);

export default IslamicPattern;
