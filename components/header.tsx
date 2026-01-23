"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <TreePine className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold text-foreground">Mémoire Familiale</h1>
              <p className="text-xs text-muted-foreground">Sahel Généalogie</p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("gap-2 touch-target", isActive && "bg-secondary")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Nouveau composant Search Command Palette */}
            <div className="hidden sm:block">
              <SearchCommand />
            </div>

            <Link href="/person/new">
              <Button className="gap-2 touch-target" size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            </Link>

            {session ? (
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                {/* Placeholder avatar user */}
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  {session.user?.name?.[0] || "U"}
                </div>
              </Button>
            ) : null}


            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="touch-target bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />

                {/* Mobile Search Link (fallback standard page if command palette too heavy for mobile menu directly, or just link to home) */}

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
