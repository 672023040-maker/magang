const sosial = [
  {
    href: 'https://www.instagram.com/did_uksw',
    icon: '/instagram.png',
    alt: 'Instagram',
    label: 'Instagram DID UKSW',
  },
  {
    href: 'https://mail.google.com/mail/?view=cm&to=did@uksw.edu',
    icon: '/email white.png',
    alt: 'Email',
    label: 'Email DID UKSW',
  },
]

export function FloatingSocial() {
  return (
    <div className="fixed right-0 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-[3px]">
      {sosial.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="flex h-11 w-12 items-center justify-center rounded-l-lg bg-[#111111]/85 backdrop-blur transition hover:bg-[#70B52A]"
        >
          <img
            src={item.icon}
            alt={item.alt}
            className="h-5 w-auto object-contain"
          />
        </a>
      ))}
    </div>
  )
}