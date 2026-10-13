/**
 * Hanya meloloskan URL http/https agar aman dipakai sebagai href.
 *
 * React 19 sebenarnya sudah memblokir skema javascript: pada href, tetapi
 * guard itu hanya berlaku di React dan hanya untuk javascript:. Helper ini
 * menjadi jaring pengaman lapis kedua — berguna untuk nilai yang sudah
 * tersimpan di database, atau bila URL nantinya dipakai di window.open /
 * window.location (yang tidak dijaga React).
 */
export function safeExternalUrl(value?: string | null): string | null {
  if (!value) return null

  try {
    const url = new URL(value.trim())

    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}
