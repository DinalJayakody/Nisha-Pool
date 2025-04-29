'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  WalletCards as BilliardBall,
  LayoutDashboard,
  Clock,
  CreditCard,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useState } from 'react';

const mainNav = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Tables',
    href: '/tables',
    icon: BilliardBall,
  },
  {
    name: 'Sessions',
    href: '/sessions',
    icon: Clock,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs">
              <div className="px-7">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <BilliardBall className="h-6 w-6" />
                  <span className="text-lg font-bold">Nisha Pool</span>
                </Link>
              </div>
              <nav className="mt-8 flex flex-col gap-2 px-2">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'transparent'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            {/* <BilliardBall className="h-6 w-6" /> */}
            <span className="text-lg font-bold hidden sm:inline-block">
              Nisha Pool Lounge
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden md:flex">
            Staff: Admin
          </Button>
        </div>
      </div>
    </header>
  );
}
