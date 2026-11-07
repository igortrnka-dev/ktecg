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
  gauge: (
    <>
      <path d="M3.5 17a8.5 8.5 0 0117 0" />
      <path d="M12 17l4.2-5.2" />
      <circle cx="12" cy="17" r="1.3" />
      <path d="M6.2 11.2l1.2 1.1M12 8.5V10M17.8 11.2l-1.2 1.1M3.5 20h17" />
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
  // divisions and sectors
  wrench: <path d="M14.5 6.5a4 4 0 015.2 5.2l-1.6-1.6-2.3.5-.5 2.3 1.6 1.6a4 4 0 01-5.2-5.2L4.6 16.4a1.6 1.6 0 002.3 2.3l7.1-7.1" />,
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3h5M10.5 3v6L5 18.5A1.7 1.7 0 006.5 21h11a1.7 1.7 0 001.5-2.5L13.5 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  pill: (
    <>
      <rect x="3.2" y="8.6" width="17.6" height="6.8" rx="3.4" transform="rotate(-45 12 12)" />
      <path d="M9.6 9.6l4.8 4.8" />
    </>
  ),
  food: (
    <>
      <path d="M6 3v7a2 2 0 002 2v9M10 3v7a2 2 0 01-2 2M8 3v5" />
      <path d="M17 21V3c-2 1.5-3 4-3 7v3h3" />
    </>
  ),
  car: (
    <>
      <path d="M4 16v-3.5L6.2 7.6A2 2 0 018 6.5h8a2 2 0 011.8 1.1l2.2 4.9V16a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
      <path d="M4 12.5h16" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="16.5" cy="17" r="1.6" />
    </>
  ),
  ship: (
    <>
      <path d="M3 15l1.8 4.5h14.4L21 15H3z" />
      <path d="M6 15V9.5h12V15M9 9.5V6h6v3.5M12 3v3" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="3.5" width="16" height="7" rx="1.5" />
      <rect x="4" y="13.5" width="16" height="7" rx="1.5" />
      <path d="M8 7h.01M8 17h.01M12 7h5M12 17h5" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17z" />
      <path d="M3 21h18M7 17h2M11 17h2M15 17h2" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10.5 21v-3h3v3" />
    </>
  ),
  plant: (
    <>
      <path d="M4 21V11h4v10M8 21v-6h5v6M13 21V8h4v13M3 21h18" />
      <path d="M15 8V4M15 4c1.5 0 2-1 3.5-1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
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
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
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
