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
    <div className="fixed right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
      {sosial.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111]/85 p-2 backdrop-blur transition hover:bg-[#70B52A]"
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