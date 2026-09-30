import type { Kontak } from '../types'

export const DEFAULT_CONTACT_EMAIL = 'did@uksw.edu'

export function resolveContactEmail(kontak: Kontak | null | undefined): string {
  return kontak?.email?.trim() || DEFAULT_CONTACT_EMAIL
}

export function mailtoHref(email: string): string {
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`
}
