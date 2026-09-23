const sosial = [
  {
    href: 'https://www.instagram.com/did_uksw',
    icon: '/instagram bulat.png',
    alt: 'Instagram',
    label: 'Instagram DID UKSW',
  },
  {
    href: 'https://mail.google.com/mail/?view=cm&to=did@uksw.edu',
    icon: '/email putih bulat.png',
    alt: 'Email',
    label: 'Email DID UKSW',
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111]/85 p-2 backdrop-blur transition hover:bg-[#70B52A] sm:h-12 sm:w-12"
        >
          <img
            src={item.icon}
            alt={item.alt}
            className="h-full w-full object-contain"
          />
        </a>
      ))}
    </div>
  )
}