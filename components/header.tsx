"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchCommand } from "@/components/search-command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Search, Menu, TreePine, LayoutDashboard, Users, Plus, Settings } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Arbre généalogique", href: "/tree", icon: TreePine },
  { name: "Membres", href: "/members", icon: Users },
  { name: "Recherche", href: "/search", icon: Search },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-[100] w-full glass border-b border-primary/10 shadow-glass">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-5 shrink-0 group">
            <div className="h-14 w-14 rounded-[1.25rem] bg-linear-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
              <TreePine className="h-8 w-8 text-white drop-shadow-md relative z-10" />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-serif text-3xl font-black text-foreground tracking-tighter leading-none group-hover:text-primary transition-colors">
                Lignage <span className="text-accent italic">TOURE</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black mt-2 opacity-70">Sagesse & Postérité</p>
            </div>
          </Link>

          {/* Navigation - Desktop Centered */}
          <nav className="hidden lg:flex items-center p-1.5 bg-muted/20 backdrop-blur-xl rounded-[1.75rem] border border-white/10 shadow-inner">
            {navigation.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} className="relative group/nav">
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-3 px-6 py-7 rounded-2xl transition-all duration-500 relative z-10",
                      isActive ? "bg-background shadow-premium text-primary font-black scale-105" : "text-muted-foreground/80 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-primary animate-pulse-soft" : "text-muted-foreground group-hover/nav:text-primary")} />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  </Button>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_oklch(var(--primary))]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden xl:block">
              <SearchCommand />
            </div>

            <div className="h-10 w-px bg-border/40 hidden md:block" />

            {session?.user?.role !== "VIEWER" && (
              <Link href="/person/new">
                <Button className="gap-3 h-14 px-8 rounded-2xl shadow-premium hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-base font-black bg-primary group" size="sm">
                  <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                  <span className="hidden xl:inline">Contribuer</span>
                </Button>
              </Link>
            )}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-secondary/50 p-1 overflow-hidden border border-border/50 group hover:border-primary/50 transition-all">
                    <div className="h-full w-full rounded-xl bg-linear-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center text-lg font-black text-primary group-hover:scale-110 transition-transform">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 glass rounded-[2rem] p-3 border-white/20 shadow-2xl animate-reveal mt-2">
                  <div className="px-4 py-4 space-y-2 mb-2 bg-primary/5 rounded-2xl">
                    <p className="text-base font-black text-foreground">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate font-medium">{session.user?.email}</p>
                    <div className="pt-2">
                      <Badge variant="outline" className="text-[10px] py-0.5 px-3 rounded-full border-primary/30 text-primary font-black uppercase tracking-widest">{session.user?.role}</Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border/20 mx-2" />
                  <DropdownMenuItem asChild className="rounded-xl py-3 cursor-pointer mt-1">
                    <Link href="/settings" className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-bold">Mon Compte</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {/* Mobile Menu Button - Ultra Sophisticated */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-background shadow-premium border-border/50 group active:scale-95 transition-all">
                  <Menu className="h-6 w-6 group-hover:text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass rounded-[2.5rem] p-4 border-white/20 shadow-2xl mt-4 animate-reveal">
                <div className="p-3 mb-4 rounded-3xl bg-muted/30">
                  <SearchCommand />
                </div>
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <DropdownMenuItem key={item.href} asChild className={cn(
                        "rounded-2xl py-4 focus:bg-primary/10 px-4",
                        isActive && "bg-primary/5"
                      )}>
                        <Link href={item.href} className="flex items-center gap-4">
                          <Icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("text-lg font-bold tracking-tight", isActive ? "text-primary" : "text-foreground")}>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
