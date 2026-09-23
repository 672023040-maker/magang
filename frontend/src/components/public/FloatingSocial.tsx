const sosial = [
  {
    href: 'https://www.instagram.com/did_uksw',
    label: 'Instagram DID UKSW',
    icon: (
      <svg
        className="h-5 w-5 text-stone-900"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: 'https://mail.google.com/mail/?view=cm&to=did@uksw.edu',
    label: 'Email DID UKSW',
    icon: (
      <svg
        className="h-5 w-5 text-stone-900"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  },
]

export function FloatingSocial() {
  return (
    <div className="fixed right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 sm:right-3">
      {sosial.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300/80 bg-[#F3EAE1] p-2 transition hover:bg-[#eadbd0] sm:h-12 sm:w-12"
        >
          {item.icon}
        </a>
      ))}
    </div>
  )
}