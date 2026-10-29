/** Small 24px outline icons, drawn for this site. */
const paths: Record<string, React.ReactNode> = {
  // trades
  weld: (
    <>
      <path d="M4 20l7-7" />
      <path d="M9.5 11.5l3 3 2.5-2.5-3-3z" />
      <path d="M16 4l.8 2.2L19 7l-2.2.8L16 10l-.8-2.2L13 7l2.2-.8z" />
      <path d="M18 14l1 1M20 11h1.5M15 17.5V19" />
    </>
  ),
  pipe: (
    <>
      <path d="M3 8h9a4 4 0 014 4v9" />
      <path d="M3 13h7a1 1 0 011 1v7" />
      <path d="M3 6.5v8M14.5 21h6" />
    </>
  ),
  beam: (
    <>
      <path d="M4 5h16M4 19h16M12 5v14" />
      <path d="M8 5v2M16 5v2M8 17v2M16 17v2" />
    </>
  ),
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />,
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </>
  ),
  cnc: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 7v5M10 12h4l-2 2z" />
      <path d="M7 20h10M9 16v4M15 16v4" />
    </>
  ),
  assembly: (
    <>
      <rect x="3" y="14" width="18" height="5" rx="1" />
      <path d="M7 14v-3h4v3M13 14V8h4v6" />
      <circle cx="7" cy="19" r="0.5" />
      <circle cx="17" cy="19" r="0.5" />
    </>
  ),
  forklift: (
    <>
      <path d="M4 17V9h6l3 5v3" />
      <path d="M17 4v13h4" />
      <path d="M13 14h4" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="13" cy="18" r="1.5" />
    </>
  ),
  // services
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5a3 3 0 010 6M18 14.5c1.8.9 3 2.9 3 5.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M7 15l4-4 3 3 5-6" />
      <path d="M15 8h4v4" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7a3 3 0 000-6H9a3 3 0 010-6h7" />
    </>
  ),
  // misc
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
};

export type IconName = keyof typeof paths;

export default function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
