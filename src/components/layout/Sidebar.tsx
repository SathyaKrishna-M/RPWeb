"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Globe, Upload, Settings, LogOut } from "lucide-react"
import { signOutAction } from "@/server/actions/session"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/characters", label: "Characters", icon: Users },
  { href: "/worlds", label: "Worlds", icon: Globe },
  { href: "/import", label: "Import", icon: Upload },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const isActiveHref = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950">
        <div className="flex h-16 items-center px-6">
          <span className="text-xl font-bold text-indigo-400">RPWeb</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = isActiveHref(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          {/* A form, not a link: signing out changes state, so it must not
              happen on a GET that a prefetch or a crawler could trigger. */}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-red-400"
            >
              <LogOut size={20} className="text-slate-500" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950 px-2 pb-safe">
        {NAV_ITEMS.map((item) => {
          const isActive = isActiveHref(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 ${
                isActive ? "text-indigo-400" : "text-slate-400"
              }`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
