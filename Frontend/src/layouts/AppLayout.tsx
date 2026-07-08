import { Moon, SunMedium, Layers } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SecondaryButton } from '../components/ui';

const links = [
  { to: '/',             label: 'Home'          },
  { to: '/questionnaire',label: 'Questionnaire' },
  { to: '/projects',     label: 'Projects'      },
  { to: '/technologies', label: 'Technologies'  },
];

export function AppLayout() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('sw-theme') === 'dark' ||
      (!localStorage.getItem('sw-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('sw-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen">
      {/* Accent line at very top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />

      <header className="glass-header sticky top-0.5 z-20 border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30">
              <Layers size={16} />
            </div>
            <span>StackWise</span>
          </NavLink>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <SecondaryButton
              aria-label="Toggle light/dark mode"
              onClick={() => setDark(v => !v)}
              className="ml-1 h-9 w-9 rounded-lg p-0"
            >
              {dark ? <SunMedium size={16} /> : <Moon size={16} />}
            </SecondaryButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-border py-6 text-center text-xs text-foreground/40">
        StackWise · Development Stack Recommendation System · Built with FastAPI + React
      </footer>
    </div>
  );
}
