import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const menu = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/profil', label: 'Profil' },
  { to: '/admin/struktur', label: 'Struktur Organisasi' },
  { to: '/admin/project', label: 'Project' },
  { to: '/admin/kontak', label: 'Kontak' },
  { to: '/admin/ganti-password', label: 'Ganti Password' },
  { to: '/admin/perangkat', label: 'Perangkat' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { admin, logout } = useAuth()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:transition-none ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-stone-200 px-5">
        <span className="font-display text-lg font-semibold text-stone-900">
          DIGFIN<span className="text-brand-600">.</span>
        </span>
        <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-stone-200 p-3">
        <p className="truncate px-3 text-sm font-medium text-stone-800">
          {admin?.nama}
        </p>
        <p className="px-3 text-xs text-stone-500">@{admin?.username}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          Keluar
        </button>
      </div>
    </aside>
  )
}